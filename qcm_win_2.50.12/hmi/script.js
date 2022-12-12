const TOKEN = "YWRtaW46";
let interval;
let disconnect = false;


// model outputs url
const car_above_ground_url = '/api/tasks/qcm/Quater_car_model:pos_car_abs'; // how high is the car above the ground
const car_wheel_url = '/api/tasks/qcm/Quater_car_model:pos_susp_meas'; // relative position of the wheel and car
const wheel_ground_url = '/api/tasks/qcm/Quater_car_model:pos_wheel'; // relative position of the wheel and ground
const force_on_wheel_url = '/api/tasks/qcm/Quater_car_model:Fl_tire'; // load force on the tire
const acceleration_url = '/api/tasks/qcm/Quater_car_model:acc_car'; // acceleration of the car

// model inputs url
const step_err_activation_url = '/api/tasks/qcm/MP_NUDGE:BSTATE'; // activation of the step error
const step_err_intensity_url = '/api/tasks/qcm/GAIN_NUDGE:k'; // step error intensity
const rand_err_amplitude_url = '/api/tasks/qcm/SG_bumps:amp'; // amplitude of the random error
const rand_err_freq_url = '/api/tasks/qcm/SG_bumps:freq'; // random error frequency
const turn_on_model_url = '/api/tasks/qcm/CNB_RUN:YCN'; // turn on the model
const reset_model_url = '/api/tasks/qcm/MP_RESET:BSTATE'; // reset the model

// HTML elements
let statusEl = document.querySelector('#status');
let car_above_ground_el = document.querySelector('#output1-value');
let car_wheel_el = document.querySelector('#output2-value');
let wheel_ground_el = document.querySelector('#output3-value');
let force_on_wheel_el = document.querySelector('#output4-value');
let acceleration_el = document.querySelector('#output5-value');

let se_el = document.querySelector('#se'); // step error intensity
let re_switch = document.querySelector('#re_switch');
let rea_el = document.querySelector('#rea'); // random error amplitude
let ref_el = document.querySelector('#ref'); // random error frequency
let model_switch = document.querySelector('#model_switch');


// POST method implementation:
async function postData(url = '', data = {}) {
    // REXYGEN specific data type and authentication
    url = url + `?mime=application/json&token=${TOKEN}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

// GET method implementation:
async function getData(url = '') {
    // REXYGEN specific data type and authentication
    url = url + `?mime=application/json&token=${TOKEN}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

/**
 * Error handling - error message is displayed in the console and in the status box
 * @param {*} err - Object with information about error
 */
function logError(err) {
    console.error(err);
    statusEl.textContent = err;
    if (interval) {
        clearInterval(interval);
    }
}

async function initWriteDatapoints() { // synchronization of the web page with the REXYGEN model
    let valueObj, value;
    try {
        valueObj = await getData(step_err_intensity_url);
        value = valueObj.v;
        se_el.value = value;

        valueObj = await getData(rand_err_amplitude_url);
        value = valueObj.v;
        rea_el.value = value;

        valueObj = await getData(rand_err_freq_url);
        value = valueObj.v;
        ref_el.value = value;

        if ((ref_el.value != 0) && (rea_el.value != 0)) { // if both random error parameters are not zero, the random error switch is on
            re_switch.checked = true;
        } else {
            re_switch.checked = false;
        }

        valueObj = await getData(turn_on_model_url);
        value = valueObj.v;
        model_switch.checked = (value === 1);
    }
    catch (err) {
        logError(err);
    }
}

async function readLoop() { // reading of the REXYGEN model outputs
    let valueObj, value;
    try {
        valueObj = await getData(car_above_ground_url);
        value = valueObj.v;
        car_above_ground_el.textContent = value.toFixed(1);
        var car_above_ground = value;

        valueObj = await getData(car_wheel_url);
        value = valueObj.v;
        car_wheel_el.textContent = value.toFixed(1);
        var car_wheel = value;

        valueObj = await getData(wheel_ground_url);
        value = valueObj.v;
        wheel_ground_el.textContent = value.toFixed(1);
        var wheel_ground = value;

        valueObj = await getData(force_on_wheel_url);
        value = valueObj.v;
        force_on_wheel_el.textContent = (value * 0.10197).toFixed(1); // conversion from N to kg

        valueObj = await getData(acceleration_url);
        value = valueObj.v;
        acceleration_el.textContent = value.toFixed(4);
        var acceleration = value;

        statusEl.textContent = "Connected";

        activate(); // activation of the inputs and switches

        animate(); // animation of the car, wheel and spring

        plotGraph();
    }
    catch (err) {
        disconnect = true; // if the connection is lost, the inputs and switches are deactivated
        logError(err);
        deactivate();
        while (disconnect) {
            await new Promise(r => setTimeout(r, 5000)); // every 5 seconds, the connection is checked
            console.log("Trying to reconnect...");

            //console log current time
            var d = new Date();
            var n = d.toLocaleTimeString();
            console.log(n);

            valueObj = await getData(car_above_ground_url);
            if (valueObj) { // if the connection is established, the web page is reloaded
                disconnect = false;
                console.log("Reconnected");
                setTimeout(() => {
                    document.location.reload();
                }, 1000);
            }
        }
    }

    function animate() { // animation of the car, wheel and spring
        let car_above_ground_init = 150;
        let car_wheel_init = 100;
        let wheel_ground_init = 50;

        // whole car animation
        var whole_car = document.getElementById("whole_car");
        var whole_car_translation = (car_above_ground / car_above_ground_init) * 250 - 250;
        whole_car.style.transform = "translateY(" + whole_car_translation + "px)";

        // wheel animation - circle -> ellipse
        var wheel = document.getElementById("wheel");
        var wheel_deformation = wheel_ground / wheel_ground_init;

        wheel.style.transformBox = "fill-box";
        wheel.style.transform = "scale(1, " + wheel_deformation + ")";
        wheel.style.transformOrigin = "bottom";

        // car animation
        var car = document.getElementById("car");
        var car_translation = (car_wheel / car_wheel_init) * 250 - 250;

        car.style.transform = "translateY(" + car_translation + "px)";

        // spring animation - spring shrinks depending on the car position and wheel position
        var spring = document.getElementById("spring");
        var spring_dumper = document.getElementById("spring_dumper");
        var spring_deformation = 2 - wheel_deformation;
        spring_deformation = spring_deformation - (car_translation / car_wheel_init);


        spring.style.transform = "translateY(" + car_translation + "px)";
        spring_dumper.style.transformBox = "fill-box";
        spring_dumper.style.transform = "scale(1, " + spring_deformation + ")";
    }

    function activate() { // activation of the inputs and switches
        se_el.removeAttribute('disabled');
        re_switch.removeAttribute('disabled');
        rea_el.removeAttribute('disabled');
        ref_el.removeAttribute('disabled');
        model_switch.removeAttribute('disabled');
    }

    function deactivate() { // deactivation of the inputs and switches
        se_el.setAttribute('disabled', '');
        re_switch.setAttribute('disabled', '');
        rea_el.setAttribute('disabled', '');
        ref_el.setAttribute('disabled', '');
        model_switch.setAttribute('disabled', '');
    }

    function plotGraph() { // plotting of the acceleration graph

        acceleration = Math.round(acceleration * 10000) / 10000;
        // compute the x-axis range
        var max_range = acceleration.toPrecision(1) * 10;
        max_range = Math.abs(max_range);
        var str_max_range = max_range.toString();
        var last_digit = str_max_range.charAt(str_max_range.length - 1);
        max_range = max_range / last_digit;

        var trace1 = {
            x: [acceleration],
            width: 0.3,
            type: 'bar',
            orientation: 'h',
            textposition: 'auto',
            hoverinfo: 'none',
            marker: {
                color: 'rgb(77, 163, 197)',
                opacity: 0.6,
            }
        };

        var layout = {
            title: 'Acceleration on driver',
            xaxis: {
                visible: true,
                constraintoward: 'center',
                range: [-max_range, max_range],
                gridcolor: 'black',
                title: 'Acceleration [mm/s²]',
            },
            yaxis: {
                visible: false,
            },
            plot_bgcolor: "#eef1f0",
            paper_bgcolor: "#eef1f0",
        };

        Plotly.newPlot('myPlot', [trace1], layout, { displaylogo: false, responsive: true, staticPlot: true });
    }

}

// Registration of the event listeners

se_el.addEventListener('change', () => { // change the step error intensity
    if (se_el.value != '') {
        postData(step_err_intensity_url, { v: parseFloat(se_el.value) });
    }
});

re_switch.addEventListener('change', () => { // activate/deactivate the random error
    if (re_switch.checked) {
        if (rea_el.value != '') {
            postData(rand_err_amplitude_url, { v: parseFloat(rea_el.value) }); // set the random error amplitude
        }
        if (ref_el.value != '') {
            postData(rand_err_freq_url, { v: parseFloat(ref_el.value) }); // set the random error frequency
        }
    }
    else {
        postData(rand_err_amplitude_url, { v: 0 }); // set the amplitude to 0
        postData(rand_err_freq_url, { v: 0 }); // set the frequency to 0
    }
});

model_switch.addEventListener('change', () => { // activate/deactivate the model
    if (model_switch.checked) {
        postData(turn_on_model_url, { v: 1 });
    }
    else {
        postData(turn_on_model_url, { v: 0 });
    }
});


function onClick_se() { // create a step error
    postData(step_err_activation_url, { v: 1 });
}

function model_reset() { // reset the model
    postData(reset_model_url, { v: 1 });
}

interval = setInterval(readLoop, 100); // read the data every 100 ms

initWriteDatapoints(); // write the initial values of the inputs and switches