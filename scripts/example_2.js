//claim variables
var renderer;
var camera;
var scene, scene2;
var light;

var orbit_ctrl;
var trfm_ctrl;
var mouse = new THREE.Vector2();
var rayCaster = new THREE.Raycaster();


var selectObj = null;


//*********************** testing new UI (tweakpane) *********************

/************************* MOVABLE LEFT DIV *************************/

const leftWrapper = document.querySelector("#left_container_wrapper");
const rightWrapper = document.querySelector("#right_container_wrapper");

function onLeftDrag(event) {
    let getStyle = window.getComputedStyle(leftWrapper);
    let leftPosition = parseInt(getStyle.left);
    let topPosition = parseInt(getStyle.top);

    leftWrapper.style.left = `${leftPosition + event.movementX}px`;
    leftWrapper.style.top = `${topPosition + event.movementY}px`;
}

function onRightDrag(event) {
    let getStyle = window.getComputedStyle(rightWrapper);
    let leftPosition = parseInt(getStyle.left);
    let topPosition = parseInt(getStyle.top);

    rightWrapper.style.left = `${leftPosition + event.movementX}px`;
    rightWrapper.style.top = `${topPosition + event.movementY}px`;
}

let isMouseDownOnLeft = false;
let isMouseDownOnRight = false;

const leftHeader = document.getElementById("left_container_header");
const rightHeader = document.getElementById("right_container_header");

leftHeader.addEventListener("mousedown", () => {
    isMouseDownOnLeft = true;
});

rightHeader.addEventListener("mousedown", () => {
    isMouseDownOnRight = true;
});

window.addEventListener("mouseup", () => {
    isMouseDownOnLeft = false;
    isMouseDownOnRight = false;
});

window.addEventListener("mousemove", function (event) {
    if (isMouseDownOnLeft) {
        onLeftDrag(event);
    }
    if (isMouseDownOnRight) {
        onRightDrag(event);
    }
});


/************************* Left Panel *************************/

//creating the first pane (left)
const paneLeft = new Tweakpane.Pane({
    container: document.getElementById('left_container'),
});

/************************* Left Panel first tab *************************/

const tab = paneLeft.addTab({
    pages: [
        {title: 'Parameters'},
        {title: 'Trial'},
        {title: 'Minkowski'},
    ],
});

// faces
const faceVisibilityCheckboxParams = {
    'face': false, //at first, box is unchecked so value is "false"
};

// faces - checkbox
const faceVisibilityCheckbox = tab.pages[0].addInput(faceVisibilityCheckboxParams, 'face').on('change', () => { //on change, dispose old plane geometry and create new
    redrawFace();
});

/************************* Left Panel second tab *************************/

const trialVisibilityCheckboxParams = {
    'on': false, //at first, box is unchecked so value is "false"
};
const trialVisibilityCheckbox = tab.pages[1].addInput(trialVisibilityCheckboxParams, 'on').on
('change', () => { //on change, dispose old plane geometry and create new
    redrawTrial();
});
const primeheightParams = {
    trialHeight: -2,
};
primeheightParams.hidden = true;
const primeHeightSlider = tab.pages[1].addInput(primeheightParams, 'trialHeight', {
    min: -4,
    max: 1,
}).on('change', (ev) => { //on change, dispose old plane geometry and create new
    fo.z = ev.value;
    redrawTrial();
});

const trialHeightSliderParams = {
    height: 0.7,
};
const trialHeightSlider = tab.pages[1].addInput(trialHeightSliderParams, 'height', {
    min: 0.5,
    max: 1,
}).on('change', (ev) => { //on change, dispose old plane geometry and create new
    triP1.z = ev.value;
    redrawTrial();
});
trialHeightSlider.hidden = true
primeHeightSlider.hidden = true

trialVisibilityCheckbox.on('change', () => { //on change, change the hidden and visibility values set
    trialHeightSlider.hidden = !trialHeightSlider.hidden
    primeHeightSlider.hidden = !primeHeightSlider.hidden
});

/************************* Left Panel third tab *************************/

const minkVisibilityCheckboxParams = {
    'show': false, //at first, box is unchecked so value is "false"
};
const minkVisibilityCheckbox = tab.pages[2].addInput(minkVisibilityCheckboxParams, 'show').on('change', (ev) => { //on change, dispose old plane geometry and create new
    tab.pages[0].children[0].disabled = !tab.pages[0].children[0].disabled;
    tab.pages[1].children[0].disabled = !tab.pages[1].children[0].disabled;
    paneRight.children[0].disabled = !paneRight.children[0].disabled;
    paneRight.children[1].disabled = !paneRight.children[1].disabled;
    paneRight.children[2].disabled = !paneRight.children[2].disabled;
    if(ev.value) {
        paneLeft.importPreset(disableFaceTrial);
    }
    redrawMink();
});

const minkParams = {
    length: -0.226,
};
const minkSlider = tab.pages[2].addInput(minkParams, 'length', {
    max: -0.01,
    min: -0.226,
    step: 0.001
}).on('change', (ev) => { //on change, dispose old geometry and create new
    minkscale.l = -ev.value;
    redrawMink();
});
minkSlider.hidden = true;
minkVisibilityCheckbox.on('change', () => { //on change, change the hidden and visibility values set
    minkSlider.hidden = !minkSlider.hidden;
});

const disableFaceTrial = paneLeft.exportPreset();
disableFaceTrial.show = true;
const disableLeftPane = paneLeft.exportPreset();

/************************* Right Panel *************************/

const paneRight = new Tweakpane.Pane({
    container: document.getElementById('right_container'),
});

const o1SizeSliderParams = {
    O1len: 2,
};

paneRight.addInput(o1SizeSliderParams, 'O1len', {
    min: -1,
    max: 3,
}).on('change', (ev) => { //on change, dispose old plane geometry and create new
    o1.l = ev.value;
    Redraw();
});

const o2SizeSliderParams = {
    O2len: 2,
};
//make the plane size slider
paneRight.addInput(o2SizeSliderParams, 'O2len', {
    min: -1,
    max: 3,
}).on('change', (ev) => { //on change, dispose old plane geometry and create new
    o2.l = ev.value;
    Redraw();
});

const forceCheckboxParams = {
    'force cell': false, //at first, box is unchecked so value is "false"
};

//make the checkbox
const forceCheckbox = paneRight.addInput(forceCheckboxParams, 'force cell').on('change', (ev) => { //on change, dispose old plane geometry and create new
    tab.pages[0].children[0].disabled = !tab.pages[0].children[0].disabled;
    tab.pages[1].children[0].disabled = !tab.pages[1].children[0].disabled;
    tab.pages[2].children[0].disabled = !tab.pages[2].children[0].disabled;
    if(ev.value) {
        paneLeft.importPreset(disableLeftPane);
    }
    Redraw();
});

const planeSizeSliderParams = {
    size: 0.7,
};
var forceCellScale = 0.7
const forceCellSlider = paneRight.addInput(planeSizeSliderParams, 'size', {
    min: 0.5,
    max: 1,
}).on('change', (ev) => {
    forceCellScale = ev.value;
    Redraw();
    force_group_c.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = ev.value;
        }
    });
    force_group_e.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = ev.value;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = ev.value;
        }
        if (obj.type === "Line") {
            obj.material.visible = ev.value;
        }
    });
    force_group_f.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = !ev.value;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = !ev.value;
        }
        if (obj.type === "Line") {
            obj.material.visible = !ev.value;
        }
    });
    force_general.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = !ev.value;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = !ev.value;
        }
        if (obj.type === "Line") {
            obj.material.visible = !ev.value;
        }
    });
});
forceCellSlider.hidden = true
forceCheckbox.on('change', () => { //on change, change the hidden and visibility values set
    forceCellSlider.hidden = !forceCellSlider.hidden;
});


var minkscale = new function () {
    this.l = 0.226
}


// *********************** form diagram initial data ***********************


var formBtPt1 = new THREE.Vector3(-0.24, -1.5, -1);
var formBtPt2 = new THREE.Vector3(-1.743, -0.82, -1);
var formBtPt3 = new THREE.Vector3(0.39, 1.03, -1);
var formBtPt4 = new THREE.Vector3(1.11, 0.31, -1);

var Ctrl_pts = new Array(4);

var form_general

var form_group_v
var form_group_f
var form_group_e
var form_group_c
var form_group_e_trial
var form_general_trial

var form_group_mink

var triP1 = new function () {
    this.z = 0.6;
}


// *********************** force diagram initial data ***********************

var force_group_v
var force_group_f
var force_group_e
var force_group_c
var force_general

var force_group_f_trial
var force_group_e_trial
var force_general_trial

var force_group_mink

var force_text

var fo = new function () {
    this.x = -1;
    this.y = -1;
    this.z = -2;
}
var o1 = new function () {
    this.l = 2;
}

var o2 = new function () {
    this.l = 2;
}

// apply loads locations o1 and o2
var formPtO1 = new THREE.Vector3(-0.5, -0.5, 1);
var formPtO2 = new THREE.Vector3(0.38, 0.31, 1);

var formPtO1b = new THREE.Vector3(-0.5, -0.5, -1.5);
var formPtO2b = new THREE.Vector3(0.38, 0.31, -1.5);

var applyline_dash_form_f = new THREE.LineDashedMaterial({
    color: 0x009600,//color
    dashSize: 0.05,
    gapSize: 0.03,
    linewidth: 1
});

function redrawFace() {
    scene.remove(form_group_f);
    form_group_f = new THREE.Group()

    // ***********************            form faces                **************************

    // green faces : o1 o2
    var greenface_O1O2 = FormFace4ptGN(formPtO1, formPtO1b, formPtO2b, formPtO2)
    form_group_f.add(greenface_O1O2);

    // green faces : o1 o1b point1
    var greenface_p1 = FormFace4ptGN(
        new THREE.Vector3(formBtPt1.x, formBtPt1.y, -1.5),
        new THREE.Vector3(formBtPt1.x, formBtPt1.y, formPtO1.z),
        formPtO1,
        formPtO1b
    )
    form_group_f.add(greenface_p1);

    var green_p1 = [];
    green_p1.push(new THREE.Vector3(formBtPt1.x, formBtPt1.y, -1.5));
    green_p1.push(new THREE.Vector3(formBtPt1.x, formBtPt1.y, formPtO1.z));
    var green_p1_geo = new THREE.BufferGeometry().setFromPoints(green_p1);
    var dashline_p1 = new THREE.LineSegments(green_p1_geo, applyline_dash_form_f);
    dashline_p1.computeLineDistances();//compute
    form_group_f.add(dashline_p1);

    // green faces : o1 o1b point2
    var greenface_p2 = FormFace4ptGN(
        new THREE.Vector3(formBtPt2.x, formBtPt2.y, -1.5),
        new THREE.Vector3(formBtPt2.x, formBtPt2.y, formPtO1.z),
        formPtO1,
        formPtO1b
    )
    form_group_f.add(greenface_p2);

    var green_p2 = [];
    green_p2.push(new THREE.Vector3(formBtPt2.x, formBtPt2.y, -1.5));
    green_p2.push(new THREE.Vector3(formBtPt2.x, formBtPt2.y, formPtO1.z));
    var green_p2_geo = new THREE.BufferGeometry().setFromPoints(green_p2);
    var dashline_p2 = new THREE.LineSegments(green_p2_geo, applyline_dash_form_f);
    dashline_p2.computeLineDistances();//compute
    form_group_f.add(dashline_p2);

    // green faces : o2 o2b point3
    var greenface_p3 = FormFace4ptGN(
        new THREE.Vector3(formBtPt3.x, formBtPt3.y, -1.5),
        new THREE.Vector3(formBtPt3.x, formBtPt3.y, formPtO2.z),
        formPtO2,
        formPtO2b
    )
    form_group_f.add(greenface_p3);

    var green_p3 = [];
    green_p3.push(new THREE.Vector3(formBtPt3.x, formBtPt3.y, -1.5));
    green_p3.push(new THREE.Vector3(formBtPt3.x, formBtPt3.y, formPtO1.z));
    var green_p3_geo = new THREE.BufferGeometry().setFromPoints(green_p3);
    var dashline_p3 = new THREE.LineSegments(green_p3_geo, applyline_dash_form_f);
    dashline_p3.computeLineDistances();//compute
    form_group_f.add(dashline_p3);

    // green faces : o2 o2b point4
    var greenface_p4 = FormFace4ptGN(
        new THREE.Vector3(formBtPt4.x, formBtPt4.y, -1.5),
        new THREE.Vector3(formBtPt4.x, formBtPt4.y, formPtO2.z),
        formPtO2,
        formPtO2b
    )
    form_group_f.add(greenface_p4);

    var green_p4 = [];
    green_p4.push(new THREE.Vector3(formBtPt4.x, formBtPt4.y, -1.5));
    green_p4.push(new THREE.Vector3(formBtPt4.x, formBtPt4.y, formPtO1.z));
    var green_p4_geo = new THREE.BufferGeometry().setFromPoints(green_p4);
    var dashline_p4 = new THREE.LineSegments(green_p4_geo, applyline_dash_form_f);
    dashline_p4.computeLineDistances();//compute
    form_group_f.add(dashline_p4);

    scene.add(form_group_f);

    form_group_f.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = faceVisibilityCheckboxParams.face;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = faceVisibilityCheckboxParams.face;
        }
    });
}

function redrawTrial() {
    scene.remove(form_group_e_trial);
    scene.remove(form_general_trial);
    scene2.remove(force_group_f_trial);
    scene2.remove(force_group_e_trial);
    scene2.remove(force_general_trial);

    form_general_trial = new THREE.Group();
    form_group_e_trial = new THREE.Group();

    force_group_f_trial = new THREE.Group();
    force_group_e_trial = new THREE.Group();
    force_general_trial = new THREE.Group();

    // ***********************            force diagram            **************************
    var edgescale = 2; // size of the force diagram

    //PtA
    var forcePtA = new THREE.Vector3(1, -1.5, 0);

    //PtB
    var forcePtBtemp = CalNormalVectorUpdated(formBtPt1, formPtO1, formPtO1b, edgescale);
    var forcePtB = new THREE.Vector3(forcePtA.x - forcePtBtemp.x, forcePtA.y - forcePtBtemp.y, forcePtA.z - forcePtBtemp.z);

    //PtC
    var forcePtC1temp = CalNormalVectorUpdated(formBtPt2, formPtO1, formPtO1b, edgescale);
    var forcePtC1 = new THREE.Vector3(forcePtB.x - forcePtC1temp.x, forcePtB.y - forcePtC1temp.y, forcePtB.z - forcePtC1temp.z);
    var forcePtC2temp = CalNormalVectorUpdated(formPtO1, formPtO2, formPtO2b, edgescale);
    var forcePtC2 = new THREE.Vector3(forcePtA.x - forcePtC2temp.x, forcePtA.y - forcePtC2temp.y, forcePtA.z - forcePtC2temp.z);
    var dirBC = new THREE.Vector3(); // create once an reuse it
    dirBC.subVectors(forcePtB, forcePtC1).normalize();
    var dirAC = new THREE.Vector3(); // create once an reuse it
    dirAC.subVectors(forcePtC2, forcePtA).normalize();

    var forcePtC = LinesSectPt(dirBC, forcePtB, dirAC, forcePtA);

    //PtD
    var forcePtD1temp = CalNormalVectorUpdated(formBtPt3, formPtO2, formPtO2b, edgescale);
    var forcePtD1 = new THREE.Vector3(forcePtC.x - forcePtD1temp.x, forcePtC.y - forcePtD1temp.y, forcePtC.z - forcePtD1temp.z);
    var forcePtD2temp = CalNormalVectorUpdated(formPtO2, formBtPt4, formPtO2b, edgescale);
    var forcePtD2 = new THREE.Vector3(forcePtA.x - forcePtD2temp.x, forcePtA.y - forcePtD2temp.y, forcePtA.z - forcePtD2temp.z);

    var dirCD = new THREE.Vector3(); // create once an reuse it
    dirCD.subVectors(forcePtC, forcePtD1).normalize();
    var dirAD = new THREE.Vector3(); // create once an reuse it
    dirAD.subVectors(forcePtD2, forcePtA).normalize();
    var forcePtD = LinesSectPt(dirCD, forcePtC, dirAD, forcePtA);

    // *********************** force trial point O **************************

    var TrialP_O = new THREE.Vector3(fo.x, fo.y, fo.z);
    var TXforceO = createSpriteTextPrime('O', "'", new THREE.Vector3(TrialP_O.x, TrialP_O.y, TrialP_O.z - 0.3));
    force_general_trial.add(TXforceO);


    const TrialP_0Sp = addVertice(0.01, "sp1", TrialP_O);
    const TrialP_0Sp_out = addVerticeOut(0.01, TrialP_0Sp.position, 1.55)
    force_general_trial.add(TrialP_0Sp);
    force_general_trial.add(TrialP_0Sp_out);

    const TrialFaces = ForceTrialFace(forcePtA, forcePtB, forcePtC, forcePtD, TrialP_O)
    force_group_f_trial.add(TrialFaces)

    // ***********************           trial form                **************************
    var DragPointMat = new THREE.MeshPhongMaterial({color: 0x696969, transparent: true, opacity: 0.8});

    var trial_P1 = new THREE.Vector3(formBtPt1.x, formBtPt1.y, triP1.z)

    var TXtrial_P1 = createSpriteTextPrime('1', "'", new THREE.Vector3(trial_P1.x, trial_P1.y, trial_P1.z - 0.3));
    form_general_trial.add(TXtrial_P1);

    var trial_o1 = create_trial_intec(trial_P1, forcePtA, TrialP_O, forcePtB, formPtO1, formPtO1b);
    var trial_P2 = create_trial_intec(trial_o1, forcePtB, TrialP_O, forcePtC, formBtPt2, new THREE.Vector3(formBtPt2.x, formBtPt2.y, formBtPt2.z - 1));
    var trial_o2 = create_trial_intec(trial_o1, forcePtA, TrialP_O, forcePtC, formPtO2, formPtO2b);
    var trial_P3 = create_trial_intec(trial_o2, forcePtC, TrialP_O, forcePtD, formBtPt3, new THREE.Vector3(formBtPt3.x, formBtPt3.y, formBtPt3.z - 1));
    var trial_P4 = create_trial_intec(trial_o2, forcePtA, TrialP_O, forcePtD, formBtPt4, new THREE.Vector3(formBtPt4.x, formBtPt4.y, formBtPt4.z - 1));


    var TXtrial_P2 = createSpriteTextPrime('2', "'", new THREE.Vector3(trial_P2.x, trial_P2.y, trial_P2.z - 0.3));
    form_general_trial.add(TXtrial_P2);
    var TXtrial_P3 = createSpriteTextPrime('3', "'", new THREE.Vector3(trial_P3.x, trial_P3.y, trial_P3.z - 0.3));
    form_general_trial.add(TXtrial_P3);
    var TXtrial_P4 = createSpriteTextPrime('4', "'", new THREE.Vector3(trial_P4.x, trial_P4.y, trial_P4.z - 0.3));
    form_general_trial.add(TXtrial_P4);

    var trial_mesh_p1o1 = createCylinderMesh(trial_o1, trial_P1, DragPointMat, 0.02, 0.02);
    var trial_mesh_p2o1 = createCylinderMesh(trial_o1, trial_P2, DragPointMat, 0.02, 0.02);
    var trial_mesh_o1o2 = createCylinderMesh(trial_o1, trial_o2, DragPointMat, 0.02, 0.02);
    var trial_mesh_p3o2 = createCylinderMesh(trial_P3, trial_o2, DragPointMat, 0.02, 0.02);
    var trial_mesh_p4o2 = createCylinderMesh(trial_P4, trial_o2, DragPointMat, 0.02, 0.02);

    form_group_e_trial.add(trial_mesh_p1o1);
    form_group_e_trial.add(trial_mesh_p2o1);
    form_group_e_trial.add(trial_mesh_o1o2);
    form_group_e_trial.add(trial_mesh_p3o2);
    form_group_e_trial.add(trial_mesh_p4o2);

    //trial form closing plane
    //plane mesh
    var trial_closingplane = FormPlane(trial_P2, trial_P1, trial_P4, trial_P3)
    form_general_trial.add(trial_closingplane);

    var trialline_dash = new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.1,
        gapSize: 0.03,
        linewidth: 1

    });

    var trial_linep1p2 = createdashline(trial_P1, trial_P2, trialline_dash)
    var trial_linep2p4 = createdashline(trial_P2, trial_P4, trialline_dash)
    var trial_linep1p4 = createdashline(trial_P1, trial_P4, trialline_dash)
    var trial_linep2p3 = createdashline(trial_P2, trial_P3, trialline_dash)
    var trial_linep3p4 = createdashline(trial_P3, trial_P4, trialline_dash)

    form_general_trial.add(trial_linep1p2);
    form_general_trial.add(trial_linep2p4);
    form_general_trial.add(trial_linep1p4);
    form_general_trial.add(trial_linep2p3);
    form_general_trial.add(trial_linep3p4);


    //trial plane face normals

    var trialmid_p1p2p4 = new THREE.Vector3((trial_P1.x + trial_P2.x + trial_P4.x) / 3, (trial_P1.y + trial_P2.y + trial_P4.y) / 3, (trial_P1.z + trial_P2.z + trial_P4.z) / 3)
    var vec_p1p2p4_temp = CalNormalVectorUpdated(trial_P4, trial_P2, trial_P1, 1.2)
    var trialnormal_p1p2p4 = new THREE.Vector3(trialmid_p1p2p4.x - 0.2 * vec_p1p2p4_temp.x, trialmid_p1p2p4.y - 0.2 * vec_p1p2p4_temp.y, trialmid_p1p2p4.z - 0.2 * vec_p1p2p4_temp.z)

    var trial_normal_material = new THREE.MeshPhongMaterial({color: "red"})
    var trial_normal_outlinematerial = new THREE.MeshPhongMaterial({color: "white", side: THREE.BackSide})
    var force_normal_material = new THREE.MeshPhongMaterial({color: "red"})

    var trial_normal_1 = createCylinderArrowMesh(trialmid_p1p2p4, trialnormal_p1p2p4, trial_normal_material, 0.015, 0.035, 0.55);
    var trial_normal_1_outline = createCylinderArrowMesh(trialmid_p1p2p4, trialnormal_p1p2p4, trial_normal_outlinematerial, 0.018, 0.038, 0.54);

    form_general_trial.add(trial_normal_1);
    form_general_trial.add(trial_normal_1_outline);


    var trialmid_p2p3p4 = new THREE.Vector3((trial_P2.x + trial_P3.x + trial_P4.x) / 3, (trial_P2.y + trial_P3.y + trial_P4.y) / 3, (trial_P2.z + trial_P3.z + trial_P4.z) / 3)
    var vec_p2p3p4_temp = CalNormalVectorUpdated(trial_P4, trial_P3, trial_P2, 1.2)
    var trialnormal_p2p3p4 = new THREE.Vector3(trialmid_p2p3p4.x - 0.2 * vec_p2p3p4_temp.x, trialmid_p2p3p4.y - 0.2 * vec_p2p3p4_temp.y, trialmid_p2p3p4.z - 0.2 * vec_p2p3p4_temp.z)

    var trial_normal_2 = createCylinderArrowMesh(trialmid_p2p3p4, trialnormal_p2p3p4, trial_normal_material, 0.015, 0.035, 0.55);
    var trial_normal_2_outline = createCylinderArrowMesh(trialmid_p2p3p4, trialnormal_p2p3p4, trial_normal_outlinematerial, 0.018, 0.038, 0.54);

    form_general_trial.add(trial_normal_2);
    form_general_trial.add(trial_normal_2_outline);

    // ***********************          find trial force point x1 and x2              **************************

    //location of x1 x2
    //find x1
    var ForceX1_vec = CalNormalVectorUpdated(trial_P1, trial_P2, trial_P4, 0.5);
    var ForceX1_temp = new THREE.Vector3(TrialP_O.x - 1.2 * ForceX1_vec.x, TrialP_O.y - 1.2 * ForceX1_vec.y, TrialP_O.z - 1.2 * ForceX1_vec.z);

    //define intersection point x1
    var intersect_x1_vec = new THREE.Vector3(ForceX1_temp.x - TrialP_O.x, ForceX1_temp.y - TrialP_O.y, ForceX1_temp.z - TrialP_O.z);
    var applyplanevec = CalNormalVectorUpdated(forcePtA, forcePtB, forcePtC, 0.5);
    var ForceX1 = Cal_Plane_Line_Intersect_Point(TrialP_O, intersect_x1_vec, forcePtB, applyplanevec);

    var line_ox1 = [];
    line_ox1.push(TrialP_O);
    line_ox1.push(ForceX1);
    var line_ox1_geo = new THREE.BufferGeometry().setFromPoints(line_ox1);
    var applyline_1 = new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.2,
        gapSize: 0.03,
        linewidth: 1
    });
    var applylineox1 = new THREE.LineSegments(line_ox1_geo, applyline_1);
    applylineox1.computeLineDistances();//compute
    force_general_trial.add(applylineox1);

    //find x2

    var ForceX2_vec = CalNormalVectorUpdated(trial_P2, trial_P4, trial_P3, 0.5);
    var ForceX2_temp = new THREE.Vector3(TrialP_O.x - 1.2 * ForceX2_vec.x, TrialP_O.y - 1.2 * ForceX2_vec.y, TrialP_O.z - 1.2 * ForceX2_vec.z);

    var intersect_x2_vec = new THREE.Vector3(ForceX2_temp.x - TrialP_O.x, ForceX2_temp.y - TrialP_O.y, ForceX2_temp.z - TrialP_O.z);
    var ForceX2 = Cal_Plane_Line_Intersect_Point(TrialP_O, intersect_x2_vec, forcePtB, applyplanevec);

    var line_ox2 = [];
    line_ox2.push(TrialP_O);
    line_ox2.push(ForceX2);

    var line_ox2_geo = new THREE.BufferGeometry().setFromPoints(line_ox2);
    var applylineox2 = new THREE.LineSegments(line_ox2_geo, applyline_1);
    applylineox2.computeLineDistances();//compute
    force_general_trial.add(applylineox2);

    //add x1 x2 arrow

    var x1_closeP1 = addVectorAlongDir(TrialP_O, ForceX1, -1);
    var x1_closeP2 = addVectorAlongDir(TrialP_O, ForceX1, -0.8);

    var x1_arrow = createCylinderArrowMesh(x1_closeP1, x1_closeP2, force_normal_material, 0.012, 0.025, 0.55);

    force_general_trial.add(x1_arrow);

    var x2_closeP1 = addVectorAlongDir(TrialP_O, ForceX2, -1);

    var x2_closeP2 = addVectorAlongDir(TrialP_O, ForceX2, -0.8);

    var x2_arrow = createCylinderArrowMesh(x2_closeP1, x2_closeP2, force_normal_material, 0.012, 0.025, 0.55);

    force_general_trial.add(x2_arrow);

    //add x1 x2 sphere
    var materialpointx = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});

    var spforcePointx = new THREE.SphereGeometry(0.01);
    var new_forcePointx1 = new THREE.Mesh(spforcePointx, materialpointx);

    new_forcePointx1.position.copy(ForceX1);

    var outlineMaterialx = new THREE.MeshBasicMaterial({color: "red", transparent: false, side: THREE.BackSide});
    var outlineMeshnewx1 = new THREE.Mesh(spforcePointx, outlineMaterialx);
    outlineMeshnewx1.position.copy(ForceX1);
    outlineMeshnewx1.scale.multiplyScalar(1.55);

    force_general_trial.add(new_forcePointx1);
    force_general_trial.add(outlineMeshnewx1);

    var TXforcex1 = createSpriteText('x', "1", new THREE.Vector3(ForceX1.x, ForceX1.y, ForceX1.z + 0.1));
    force_general_trial.add(TXforcex1);

    var new_forcePointx2 = new THREE.Mesh(spforcePointx, materialpointx);

    new_forcePointx2.position.copy(ForceX2);

    var outlineMaterialx = new THREE.MeshBasicMaterial({color: "red", transparent: false, side: THREE.BackSide});
    var outlineMeshnewx2 = new THREE.Mesh(spforcePointx, outlineMaterialx);
    outlineMeshnewx2.position.copy(ForceX2);
    outlineMeshnewx2.scale.multiplyScalar(1.55);

    force_general_trial.add(new_forcePointx2);
    force_general_trial.add(outlineMeshnewx2);
    var TXforcex2 = createSpriteText('x', "2", new THREE.Vector3(ForceX2.x, ForceX2.y, ForceX2.z + 0.1));
    force_general_trial.add(TXforcex2);

    scene.add(form_group_e_trial);
    scene.add(form_general_trial);

    scene2.add(force_group_e_trial);
    scene2.add(force_group_f_trial);
    scene2.add(force_general_trial);

    form_group_e_trial.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = trialVisibilityCheckboxParams.on;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = trialVisibilityCheckboxParams.on;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = trialVisibilityCheckboxParams.on;
        }
    });
    form_general_trial.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = trialVisibilityCheckboxParams.on;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = trialVisibilityCheckboxParams.on;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = trialVisibilityCheckboxParams.on;
        }
    });

    force_general_trial.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = trialVisibilityCheckboxParams.on;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = trialVisibilityCheckboxParams.on;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = trialVisibilityCheckboxParams.on;
        }
    });

    force_group_f_trial.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = trialVisibilityCheckboxParams.on;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = trialVisibilityCheckboxParams.on;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = trialVisibilityCheckboxParams.on;
        }
    });
}

function redrawMink() {
    scene.remove(form_group_mink);
    scene2.remove(force_group_mink);

    form_group_mink = new THREE.Group();
    force_group_mink = new THREE.Group();

    // ***********************            force diagram            **************************
    var edgescale = 2; // size of the force diagram

    //PtA
    var forcePtA = new THREE.Vector3(1, -1.5, 0);

    //PtB
    var forcePtBtemp = CalNormalVectorUpdated(formBtPt1, formPtO1, formPtO1b, edgescale);
    var forcePtB = new THREE.Vector3(forcePtA.x - forcePtBtemp.x, forcePtA.y - forcePtBtemp.y, forcePtA.z - forcePtBtemp.z);

    //PtC
    var forcePtC1temp = CalNormalVectorUpdated(formBtPt2, formPtO1, formPtO1b, edgescale);
    var forcePtC1 = new THREE.Vector3(forcePtB.x - forcePtC1temp.x, forcePtB.y - forcePtC1temp.y, forcePtB.z - forcePtC1temp.z);
    var forcePtC2temp = CalNormalVectorUpdated(formPtO1, formPtO2, formPtO2b, edgescale);
    var forcePtC2 = new THREE.Vector3(forcePtA.x - forcePtC2temp.x, forcePtA.y - forcePtC2temp.y, forcePtA.z - forcePtC2temp.z);
    var dirBC = new THREE.Vector3(); // create once an reuse it
    dirBC.subVectors(forcePtB, forcePtC1).normalize();
    var dirAC = new THREE.Vector3(); // create once an reuse it
    dirAC.subVectors(forcePtC2, forcePtA).normalize();

    var forcePtC = LinesSectPt(dirBC, forcePtB, dirAC, forcePtA);

    //PtD
    var forcePtD1temp = CalNormalVectorUpdated(formBtPt3, formPtO2, formPtO2b, edgescale);
    var forcePtD1 = new THREE.Vector3(forcePtC.x - forcePtD1temp.x, forcePtC.y - forcePtD1temp.y, forcePtC.z - forcePtD1temp.z);
    var forcePtD2temp = CalNormalVectorUpdated(formPtO2, formBtPt4, formPtO2b, edgescale);
    var forcePtD2 = new THREE.Vector3(forcePtA.x - forcePtD2temp.x, forcePtA.y - forcePtD2temp.y, forcePtA.z - forcePtD2temp.z);

    var dirCD = new THREE.Vector3(); // create once an reuse it
    dirCD.subVectors(forcePtC, forcePtD1).normalize();
    var dirAD = new THREE.Vector3(); // create once an reuse it
    dirAD.subVectors(forcePtD2, forcePtA).normalize();
    var forcePtD = LinesSectPt(dirCD, forcePtC, dirAD, forcePtA);

    // *********************** force trial point O **************************

    var TrialP_O = new THREE.Vector3(fo.x, fo.y, fo.z);

    // ***********************           trial form                **************************

    var trial_P1 = new THREE.Vector3(formBtPt1.x, formBtPt1.y, triP1.z)

    var trial_o1 = create_trial_intec(trial_P1, forcePtA, TrialP_O, forcePtB, formPtO1, formPtO1b);
    var trial_P2 = create_trial_intec(trial_o1, forcePtB, TrialP_O, forcePtC, formBtPt2, new THREE.Vector3(formBtPt2.x, formBtPt2.y, formBtPt2.z - 1));
    var trial_o2 = create_trial_intec(trial_o1, forcePtA, TrialP_O, forcePtC, formPtO2, formPtO2b);
    var trial_P3 = create_trial_intec(trial_o2, forcePtC, TrialP_O, forcePtD, formBtPt3, new THREE.Vector3(formBtPt3.x, formBtPt3.y, formBtPt3.z - 1));
    var trial_P4 = create_trial_intec(trial_o2, forcePtA, TrialP_O, forcePtD, formBtPt4, new THREE.Vector3(formBtPt4.x, formBtPt4.y, formBtPt4.z - 1))

    // ***********************          find trial force point x1 and x2              **************************

    //location of x1 x2
    //find x1
    var ForceX1_vec = CalNormalVectorUpdated(trial_P1, trial_P2, trial_P4, 0.5);
    var ForceX1_temp = new THREE.Vector3(TrialP_O.x - 1.2 * ForceX1_vec.x, TrialP_O.y - 1.2 * ForceX1_vec.y, TrialP_O.z - 1.2 * ForceX1_vec.z);

    //define intersection point x1
    var intersect_x1_vec = new THREE.Vector3(ForceX1_temp.x - TrialP_O.x, ForceX1_temp.y - TrialP_O.y, ForceX1_temp.z - TrialP_O.z);
    var applyplanevec = CalNormalVectorUpdated(forcePtA, forcePtB, forcePtC, 0.5);
    var ForceX1 = Cal_Plane_Line_Intersect_Point(TrialP_O, intersect_x1_vec, forcePtB, applyplanevec);

    //find x2

    var ForceX2_vec = CalNormalVectorUpdated(trial_P2, trial_P4, trial_P3, 0.5);
    var ForceX2_temp = new THREE.Vector3(TrialP_O.x - 1.2 * ForceX2_vec.x, TrialP_O.y - 1.2 * ForceX2_vec.y, TrialP_O.z - 1.2 * ForceX2_vec.z);

    var intersect_x2_vec = new THREE.Vector3(ForceX2_temp.x - TrialP_O.x, ForceX2_temp.y - TrialP_O.y, ForceX2_temp.z - TrialP_O.z);
    var ForceX2 = Cal_Plane_Line_Intersect_Point(TrialP_O, intersect_x2_vec, forcePtB, applyplanevec);

    //draw x1o1, x2o2
    //find constrain point o1

    var ForceO1_temp = CalNormalVectorUpdated(formBtPt1, formBtPt2, formBtPt4, 0.5);
    var ForceO1 = new THREE.Vector3(ForceX1.x - o1.l * ForceO1_temp.x, ForceX1.y - o1.l * ForceO1_temp.y, ForceX1.z - o1.l * ForceO1_temp.z);

    //find constrain point o2

    var ForceO2_temp = CalNormalVectorUpdated(formBtPt2, formBtPt3, formBtPt4, 0.5);
    var ForceO2 = new THREE.Vector3(ForceX2.x - o2.l * ForceO2_temp.x, ForceX2.y - o2.l * ForceO2_temp.y, ForceX2.z - o2.l * ForceO2_temp.z);

    // ***********************          find form edges        **************************

    //New Point o1
    var formPt1 = CalNormalVectorUpdated(forcePtA, ForceO1, forcePtB, 0.5);
    var formPt1end = new THREE.Vector3(formBtPt1.x - 1.2 * formPt1.x, formBtPt1.y - 1.2 * formPt1.y, formBtPt1.z - 1.2 * formPt1.z);
    var formPt2 = CalNormalVectorUpdated(forcePtC, ForceO1, forcePtB, 0.5);
    var formPt2end = new THREE.Vector3(formBtPt2.x - 1.2 * formPt2.x, formBtPt2.y - 1.2 * formPt2.y, formBtPt2.z - 1.2 * formPt2.z);

    var diro1 = new THREE.Vector3(); // create once an reuse it
    diro1.subVectors(formBtPt1, formPt1end).normalize();
    var diro12 = new THREE.Vector3(); // create once an reuse it
    diro12.subVectors(formBtPt2, formPt2end).normalize();
    var formPtO1new = LinesSectPt(diro1, formBtPt1, diro12, formBtPt2);
    var materialpointo = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
    var spformPointO1 = new THREE.SphereGeometry(0.04);
    var new_formPtO1 = new THREE.Mesh(spformPointO1, materialpointo);
    new_formPtO1.position.copy(formPtO1new);
    new_formPtO1.castShadow = true;
    var outlineMaterial1 = new THREE.MeshBasicMaterial({color: "black", transparent: false, side: THREE.BackSide});
    var outlineMeshnew1 = new THREE.Mesh(spformPointO1, outlineMaterial1);
    outlineMeshnew1.position.copy(formPtO1new);
    outlineMeshnew1.scale.multiplyScalar(1.55);

    //New Point o2
    var formPt3 = CalNormalVectorUpdated(forcePtD, forcePtC, ForceO2, 0.5);
    var formPt3end = new THREE.Vector3(formBtPt3.x - 1.2 * formPt3.x, formBtPt3.y - 1.2 * formPt3.y, formBtPt3.z - 1.2 * formPt3.z);
    var formPt4 = CalNormalVectorUpdated(forcePtA, forcePtD, ForceO2, 0.5);
    var formPt4end = new THREE.Vector3(formBtPt4.x - 1.2 * formPt4.x, formBtPt4.y - 1.2 * formPt4.y, formBtPt4.z - 1.2 * formPt4.z);

    var diro2 = new THREE.Vector3(); // create once an reuse it
    diro2.subVectors(formBtPt3, formPt3end).normalize();
    var diro22 = new THREE.Vector3(); // create once an reuse it
    diro22.subVectors(formBtPt4, formPt4end).normalize();
    var formPtO2new = LinesSectPt(diro2, formBtPt3, diro22, formBtPt4);
    var materialpointo = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
    var spformPointO2 = new THREE.SphereGeometry(0.04);
    var new_formPtO2 = new THREE.Mesh(spformPointO2, materialpointo);
    new_formPtO2.position.copy(formPtO2new);
    new_formPtO2.castShadow = true;
    var outlineMaterial2 = new THREE.MeshBasicMaterial({color: "black", transparent: false, side: THREE.BackSide});
    var outlineMeshnew2 = new THREE.Mesh(spformPointO2, outlineMaterial2);
    outlineMeshnew2.position.copy(formPtO2new);
    outlineMeshnew2.scale.multiplyScalar(1.55);

    //New Point o3
    var formPtO3a = CalNormalVectorUpdated(forcePtC, forcePtA, ForceO1, 0.5);
    var formPtO3aend = new THREE.Vector3(formPtO1new.x - 1.2 * formPtO3a.x, formPtO1new.y - 1.2 * formPtO3a.y, formPtO1new.z - 1.2 * formPtO3a.z);
    var formPtO3b = CalNormalVectorUpdated(forcePtA, forcePtC, ForceO2, 0.5);
    var formPtO3bend = new THREE.Vector3(formPtO2new.x - 1.2 * formPtO3b.x, formPtO2new.y - 1.2 * formPtO3b.y, formPtO2new.z - 1.2 * formPtO3b.z);

    var diro3 = new THREE.Vector3(); // create once an reuse it
    diro3.subVectors(formPtO1new, formPtO3aend).normalize();
    var diro32 = new THREE.Vector3(); // create once an reuse it
    diro32.subVectors(formPtO2new, formPtO3bend).normalize();
    var formPtO3new = LinesSectPt(diro3, formPtO1new, diro32, formPtO2new);
    var materialpointo = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
    var spformPointO3 = new THREE.SphereGeometry(0.04);
    var new_formPtO3 = new THREE.Mesh(spformPointO3, materialpointo);
    new_formPtO3.position.copy(formPtO3new);
    new_formPtO3.castShadow = true;
    var outlineMaterial3 = new THREE.MeshBasicMaterial({color: "black", transparent: false, side: THREE.BackSide});
    var outlineMeshnew3 = new THREE.Mesh(spformPointO3, outlineMaterial3);
    outlineMeshnew3.position.copy(formPtO3new);
    outlineMeshnew3.scale.multiplyScalar(1.55);


    //Cal areas
    var areaACO2 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtA, ForceO2),
        new THREE.Vector3().subVectors(forcePtC, ForceO2),
    ).length() / 2

    var areaCO1O2 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(ForceO1, forcePtC),
        new THREE.Vector3().subVectors(ForceO2, forcePtC),
    ).length() / 2

    var areaAO1O2 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(ForceO1, forcePtA),
        new THREE.Vector3().subVectors(ForceO2, forcePtA),
    ).length() / 2

    var areaACO1 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtC, ForceO1),
        new THREE.Vector3().subVectors(forcePtA, ForceO1),
    ).length() / 2

    var areaABO1 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtB, ForceO1),
        new THREE.Vector3().subVectors(forcePtA, ForceO1),
    ).length() / 2

    var areaBCO1 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtB, ForceO1),
        new THREE.Vector3().subVectors(forcePtC, ForceO1),
    ).length() / 2

    var areaCDO2 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtC, ForceO2),
        new THREE.Vector3().subVectors(forcePtD, ForceO2),
    ).length() / 2

    var areaADO2 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtA, ForceO2),
        new THREE.Vector3().subVectors(forcePtD, ForceO2),
    ).length() / 2

    var areaMax = Math.max(areaACO2, areaCO1O2, areaAO1O2, areaACO1, areaABO1, areaBCO1, areaCDO2, areaADO2)

    // ********************************** Minkowski Sum Generation ************************************

    //Minkowski Test
    var formMSedgeMaterial = new THREE.MeshPhongMaterial({
        color: "lightgrey"
    });

    var minkedgeSize = 0.005
    // chose the start point - formPtO1new (z - 0.5)
    var minkStPt = new THREE.Vector3(formPtO1new.x, formPtO1new.y, formPtO1new.z)

    // ******************          - force cell ABCO1 - cell at minkStPt ******************
    var formMSedgeBO1temp = subVecUpdated(forcePtB, ForceO1)
    var formMSptB_ABCO1 = new THREE.Vector3(
        minkStPt.x - minkscale.l * formMSedgeBO1temp.x,
        minkStPt.y - minkscale.l * formMSedgeBO1temp.y,
        minkStPt.z - minkscale.l * formMSedgeBO1temp.z
    );
    const formMSedgeBO1 = createCylinderMesh(minkStPt, formMSptB_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBO1)

    var formMSedgeAO1temp = subVecUpdated(forcePtA, ForceO1)
    var formMSptA_ABCO1 = new THREE.Vector3(
        minkStPt.x - minkscale.l * formMSedgeAO1temp.x,
        minkStPt.y - minkscale.l * formMSedgeAO1temp.y,
        minkStPt.z - minkscale.l * formMSedgeAO1temp.z
    );
    const formMSedgeAO1 = createCylinderMesh(minkStPt, formMSptA_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAO1)

    var formMSedgeCO1temp = subVecUpdated(forcePtC, ForceO1)
    var formMSptC_ABCO1 = new THREE.Vector3(
        minkStPt.x - minkscale.l * formMSedgeCO1temp.x,
        minkStPt.y - minkscale.l * formMSedgeCO1temp.y,
        minkStPt.z - minkscale.l * formMSedgeCO1temp.z
    );
    const formMSedgeCO1 = createCylinderMesh(minkStPt, formMSptC_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeCO1)

    const formMSedgeAB_ABCO1 = createCylinderMesh(formMSptB_ABCO1, formMSptA_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAB_ABCO1)
    const formMSedgeBC_ABCO1 = createCylinderMesh(formMSptB_ABCO1, formMSptC_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBC_ABCO1)
    const formMSedgeAC_ABCO1 = createCylinderMesh(formMSptA_ABCO1, formMSptC_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAC_ABCO1)

    // 1.1 - project to formBtPt1
    // a. from formMSptBO1 (0.8 is the max number of minkscale.l)

    var formMSptBO1_BtPt1 = new THREE.Vector3(
        formBtPt1.x - minkscale.l * formMSedgeBO1temp.x,
        formBtPt1.y - minkscale.l * formMSedgeBO1temp.y,
        formBtPt1.z - minkscale.l * formMSedgeBO1temp.z
    );
    const formMSedgeBO1_BtPt1 = createCylinderMesh(formBtPt1, formMSptBO1_BtPt1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBO1_BtPt1)

    var formMSptAO1_BtPt1 = new THREE.Vector3(
        formBtPt1.x - minkscale.l * formMSedgeAO1temp.x,
        formBtPt1.y - minkscale.l * formMSedgeAO1temp.y,
        formBtPt1.z - minkscale.l * formMSedgeAO1temp.z
    );
    const formMSedgeAO1_BtPt1 = createCylinderMesh(formBtPt1, formMSptAO1_BtPt1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAO1_BtPt1)

    const formMSedgeAO1BO1_BtPt1 = createCylinderMesh(formMSptAO1_BtPt1, formMSptBO1_BtPt1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAO1BO1_BtPt1)

    //connecting the rest edges back to cell ABCO1
    const formMSedgeminkStPt_BtPt1 = createCylinderMesh(minkStPt, formBtPt1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeminkStPt_BtPt1)

    const formMSedgeAO1_edge = createCylinderMesh(formMSptA_ABCO1, formMSptAO1_BtPt1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAO1_edge)

    const formMSedgeBO1_edge = createCylinderMesh(formMSptB_ABCO1, formMSptBO1_BtPt1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBO1_edge)

    var formMSptBO1_BtPt2 = new THREE.Vector3(
        formBtPt2.x - minkscale.l * formMSedgeBO1temp.x,
        formBtPt2.y - minkscale.l * formMSedgeBO1temp.y,
        formBtPt2.z - minkscale.l * formMSedgeBO1temp.z
    );
    const formMSedgeBO1_BtPt2 = createCylinderMesh(formBtPt2, formMSptBO1_BtPt2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBO1_BtPt2)

    var formMSptCO1_BtPt2 = new THREE.Vector3(
        formBtPt2.x - minkscale.l * formMSedgeCO1temp.x,
        formBtPt2.y - minkscale.l * formMSedgeCO1temp.y,
        formBtPt2.z - minkscale.l * formMSedgeCO1temp.z
    );
    const formMSedgeCO1_BtPt2 = createCylinderMesh(formBtPt2, formMSptCO1_BtPt2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeCO1_BtPt2)

    const formMSedgeCO1BO1_BtPt1 = createCylinderMesh(formMSptCO1_BtPt2, formMSptBO1_BtPt2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeCO1BO1_BtPt1)

    //connecting the rest edges to cell ABCO1
    const formMSedgeminkStPt_BtPt2 = createCylinderMesh(minkStPt, formBtPt2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeminkStPt_BtPt2)

    const formMSedgeCO1_edge = createCylinderMesh(formMSptC_ABCO1, formMSptCO1_BtPt2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeCO1_edge)

    const formMSedgeBO1_edge2 = createCylinderMesh(formMSptB_ABCO1, formMSptBO1_BtPt2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBO1_edge2)

    // ******************          - force cell ACO1O2 - cell at formPtO3new ******************
    // 2 - force cell ACO1O2 to formPtO3new

    var formMSptA_ACO1O2 = new THREE.Vector3(
        formPtO3new.x - minkscale.l * formMSedgeAO1temp.x,
        formPtO3new.y - minkscale.l * formMSedgeAO1temp.y,
        formPtO3new.z - minkscale.l * formMSedgeAO1temp.z
    );
    const formMSedgeAO1_ACO1O2 = createCylinderMesh(formPtO3new, formMSptA_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAO1_ACO1O2)

    var formMSptO1O2temp = subVecUpdated(ForceO2, ForceO1);
    var formMSptO2_ACO1O2 = new THREE.Vector3(
        formPtO3new.x - minkscale.l * formMSptO1O2temp.x,
        formPtO3new.y - minkscale.l * formMSptO1O2temp.y,
        formPtO3new.z - minkscale.l * formMSptO1O2temp.z
    );
    const formMSedgePtO3O2_ACO1O2 = createCylinderMesh(formPtO3new, formMSptO2_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgePtO3O2_ACO1O2)

    var formMSptC_ACO1O2 = new THREE.Vector3(
        formPtO3new.x - minkscale.l * formMSedgeCO1temp.x,
        formPtO3new.y - minkscale.l * formMSedgeCO1temp.y,
        formPtO3new.z - minkscale.l * formMSedgeCO1temp.z
    );
    const formMSedgePtO3C_ACO1O2 = createCylinderMesh(formPtO3new, formMSptC_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgePtO3C_ACO1O2)

    const formMSedgeAO2_ACO1O2 = createCylinderMesh(formMSptA_ACO1O2, formMSptO2_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAO2_ACO1O2)
    const formMSedgeAC_ACO1O2 = createCylinderMesh(formMSptA_ACO1O2, formMSptC_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAC_ACO1O2)
    const formMSedgeCO2_ACO1O2 = createCylinderMesh(formMSptC_ACO1O2, formMSptO2_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeCO2_ACO1O2)

    // connecting cell ACO1O2 to cell ABCO1
    const formMSedgeAA_cell1tocell2 = createCylinderMesh(formMSptA_ACO1O2, formMSptA_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAA_cell1tocell2)
    const formMSedgeO1O3_cell1tocell2 = createCylinderMesh(formPtO1new, formPtO3new, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeO1O3_cell1tocell2)
    const formMSedgeCC_cell1tocell2 = createCylinderMesh(formMSptC_ACO1O2, formMSptC_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeCC_cell1tocell2)

    // project the cell ACO1O2 to BtPt2
    var formMSedgeO1O2temp = subVecUpdated(ForceO2, ForceO1)
    var formMSptO2_BtPt2 = new THREE.Vector3(
        formBtPt2.x - minkscale.l * formMSedgeO1O2temp.x,
        formBtPt2.y - minkscale.l * formMSedgeO1O2temp.y,
        formBtPt2.z - minkscale.l * formMSedgeO1O2temp.z
    );
    const formMSedgeO1O2_BtPt2 = createCylinderMesh(formBtPt2, formMSptO2_BtPt2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeO1O2_BtPt2)

    const formMSedgeCO2_BtPt2 = createCylinderMesh(formMSptO2_ACO1O2, formMSptO2_BtPt2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeCO2_BtPt2)

    const formMSedgePt2O3_BtPt2 = createCylinderMesh(formBtPt2, formPtO3new, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgePt2O3_BtPt2)

    const formMSedgePtCO2_BtPt2 = createCylinderMesh(formMSptO2_BtPt2, formMSptCO1_BtPt2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgePtCO2_BtPt2)

    const formMSedgePtCC_BtPt2 = createCylinderMesh(formMSptC_ACO1O2, formMSptCO1_BtPt2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgePtCC_BtPt2)

    // ******************          - force cell ACDO2 - cell at formPtO2new ******************
    // 2 - force cell ACDO2 to formPtO3new
    var formMSedgeAO2temp = subVecUpdated(forcePtA, ForceO2)
    // define the new node to replace the formPtO2new
    var formMSedgeO2O3temp = subVecUpdated(formPtO2new, formPtO3new)
    var formPtO2new_mink = new THREE.Vector3(
        formMSptO2_ACO1O2.x - formMSedgeO2O3temp.x,
        formMSptO2_ACO1O2.y - formMSedgeO2O3temp.y,
        formMSptO2_ACO1O2.z - formMSedgeO2O3temp.z
    );

    var formMSptA_ACDO2 = new THREE.Vector3(
        formPtO2new_mink.x - minkscale.l * formMSedgeAO2temp.x,
        formPtO2new_mink.y - minkscale.l * formMSedgeAO2temp.y,
        formPtO2new_mink.z - minkscale.l * formMSedgeAO2temp.z
    );
    const formMSedgeAO2_ACDO2 = createCylinderMesh(formPtO2new_mink, formMSptA_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAO2_ACDO2)

    var formMSedgeCO2temp = subVecUpdated(forcePtC, ForceO2)
    var formMSptC_ACDO2 = new THREE.Vector3(
        formPtO2new_mink.x - minkscale.l * formMSedgeCO2temp.x,
        formPtO2new_mink.y - minkscale.l * formMSedgeCO2temp.y,
        formPtO2new_mink.z - minkscale.l * formMSedgeCO2temp.z
    );
    const formMSedgeCO2_ACDO2 = createCylinderMesh(formPtO2new_mink, formMSptC_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeCO2_ACDO2)

    var formMSedgeDO2temp = subVecUpdated(forcePtD, ForceO2)
    var formMSptD_ACDO2 = new THREE.Vector3(
        formPtO2new_mink.x - minkscale.l * formMSedgeDO2temp.x,
        formPtO2new_mink.y - minkscale.l * formMSedgeDO2temp.y,
        formPtO2new_mink.z - minkscale.l * formMSedgeDO2temp.z
    );
    const formMSedgeDO2_ACDO2 = createCylinderMesh(formPtO2new_mink, formMSptD_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeDO2_ACDO2)

    const formMSedgeAD_ACDO2 = createCylinderMesh(formMSptA_ACDO2, formMSptD_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAD_ACDO2)

    const formMSedgeCD_ACDO2 = createCylinderMesh(formMSptC_ACDO2, formMSptD_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeCD_ACDO2)

    const formMSedgeAC_ACDO2 = createCylinderMesh(formMSptA_ACDO2, formMSptC_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAC_ACDO2)

    // project to BtPt4
    // replace the new point to BtPt4
    var formMSedgeO2BtPt4temp = subVecUpdated(formBtPt4, formPtO2new)
    var formBtPt4_mink = new THREE.Vector3(
        formPtO2new_mink.x - formMSedgeO2BtPt4temp.x,
        formPtO2new_mink.y - formMSedgeO2BtPt4temp.y,
        formPtO2new_mink.z - formMSedgeO2BtPt4temp.z
    );

    var formMSptAO2_BtPt4 = new THREE.Vector3(
        formBtPt4_mink.x - minkscale.l * formMSedgeAO2temp.x,
        formBtPt4_mink.y - minkscale.l * formMSedgeAO2temp.y,
        formBtPt4_mink.z - minkscale.l * formMSedgeAO2temp.z
    );
    const formMSedgeAO2_BtPt4 = createCylinderMesh(formBtPt4_mink, formMSptAO2_BtPt4, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAO2_BtPt4)

    var formMSptDO2_BtPt4 = new THREE.Vector3(
        formBtPt4_mink.x - minkscale.l * formMSedgeDO2temp.x,
        formBtPt4_mink.y - minkscale.l * formMSedgeDO2temp.y,
        formBtPt4_mink.z - minkscale.l * formMSedgeDO2temp.z
    );
    const formMSedgeDO2_BtPt4 = createCylinderMesh(formBtPt4_mink, formMSptDO2_BtPt4, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeDO2_BtPt4)

    const formMSedgeAD_BtPt4 = createCylinderMesh(formMSptAO2_BtPt4, formMSptDO2_BtPt4, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAD_BtPt4)

    // connecting rest edges to BtPt4
    const formMSedgeDD_BtPt4 = createCylinderMesh(formMSptD_ACDO2, formMSptDO2_BtPt4, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeDD_BtPt4)
    const formMSedgeAA_BtPt4 = createCylinderMesh(formMSptA_ACDO2, formMSptAO2_BtPt4, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAA_BtPt4)
    const formMSedgeO2_BtPt4 = createCylinderMesh(formPtO2new_mink, formBtPt4_mink, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeO2_BtPt4)

    // project to BtPt3
    // replace the new point to BtPt3
    var formMSedgeO2BtPt3temp = subVecUpdated(formBtPt3, formPtO2new)
    var formBtPt3_mink = new THREE.Vector3(
        formPtO2new_mink.x - formMSedgeO2BtPt3temp.x,
        formPtO2new_mink.y - formMSedgeO2BtPt3temp.y,
        formPtO2new_mink.z - formMSedgeO2BtPt3temp.z
    );

    var formMSptCO2_BtPt3 = new THREE.Vector3(
        formBtPt3_mink.x - minkscale.l * formMSedgeCO2temp.x,
        formBtPt3_mink.y - minkscale.l * formMSedgeCO2temp.y,
        formBtPt3_mink.z - minkscale.l * formMSedgeCO2temp.z
    );
    const formMSedgeCO2_BtPt3 = createCylinderMesh(formBtPt3_mink, formMSptCO2_BtPt3, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeCO2_BtPt3)

    var formMSptDO2_BtPt3 = new THREE.Vector3(
        formBtPt3_mink.x - minkscale.l * formMSedgeDO2temp.x,
        formBtPt3_mink.y - minkscale.l * formMSedgeDO2temp.y,
        formBtPt3_mink.z - minkscale.l * formMSedgeDO2temp.z
    );
    const formMSedgeDO2_BtPt3 = createCylinderMesh(formBtPt3_mink, formMSptDO2_BtPt3, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeDO2_BtPt3)

    const formMSedgeCD_BtPt3 = createCylinderMesh(formMSptCO2_BtPt3, formMSptDO2_BtPt3, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeCD_BtPt3)

    // connecting rest edges to BtPt3
    const formMSedgeDD_BtPt3 = createCylinderMesh(formMSptD_ACDO2, formMSptDO2_BtPt3, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeDD_BtPt3)
    const formMSedgeCC_BtPt3 = createCylinderMesh(formMSptC_ACDO2, formMSptCO2_BtPt3, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeCC_BtPt3)
    const formMSedgeO2_BtPt3 = createCylinderMesh(formPtO2new_mink, formBtPt3_mink, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeO2_BtPt3)

    // project to BtPt4 from cell ACO1O2
    var formMSptO1O2_BtPt4 = new THREE.Vector3(
        formBtPt4_mink.x + minkscale.l * formMSedgeO1O2temp.x,
        formBtPt4_mink.y + minkscale.l * formMSedgeO1O2temp.y,
        formBtPt4_mink.z + minkscale.l * formMSedgeO1O2temp.z
    );
    const formMSedgeO1O2_BtPt4 = createCylinderMesh(formBtPt4_mink, formMSptO1O2_BtPt4, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeO1O2_BtPt4)

    const formMSedgeAO1O2_BtPt4 = createCylinderMesh(formMSptAO2_BtPt4, formMSptO1O2_BtPt4, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAO1O2_BtPt4)

    // connecting rest edges
    const formMSedgeAA_BtPt4_ACO1O2 = createCylinderMesh(formMSptAO2_BtPt4, formMSptA_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAA_BtPt4_ACO1O2)

    const formMSedgeO3_BtPt4_ACO1O2 = createCylinderMesh(formPtO3new, formMSptO1O2_BtPt4, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeO3_BtPt4_ACO1O2)

    const formMSedgeO2_BtPt4_ACO1O2 = createCylinderMesh(formBtPt4_mink, formMSptO2_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeO2_BtPt4_ACO1O2)


    // connecting cell ACO1O2 & ACDO2
    const formMSedgeAA_ACDO2_ACO1O2 = createCylinderMesh(formMSptA_ACDO2, formMSptA_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAA_ACDO2_ACO1O2)
    const formMSedgeCC_ACDO2_ACO1O2 = createCylinderMesh(formMSptC_ACDO2, formMSptC_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeCC_ACDO2_ACO1O2)
    const formMSedgeO2_ACDO2_ACO1O2 = createCylinderMesh(formMSptO2_ACO1O2, formPtO2new_mink, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeO2_ACDO2_ACO1O2)

    // ********************************** Minkowski Sum Generation - force ************************************

    var sliderSize = 0.8

    var minkS = 2.5

    //******************* 1. - Cell ABCO1 （new) *******************

    // find the starting point - O1 from Cell ABCO1
    var forceMSptO1_ABCO1 = Pnt_copy(new THREE.Vector3(formPtO1new.x, formPtO1new.y, formPtO1new.z))

    // find - B from Cell ABCO1
    var formMSedgetempB_ABCO1 = subVecUpdated(forcePtB, ForceO1)
    var forceMSptB_ABCO1 = new THREE.Vector3(
        forceMSptO1_ABCO1.x - (sliderSize - minkS * minkscale.l) * formMSedgetempB_ABCO1.x,
        forceMSptO1_ABCO1.y - (sliderSize - minkS * minkscale.l) * formMSedgetempB_ABCO1.y,
        forceMSptO1_ABCO1.z - (sliderSize - minkS * minkscale.l) * formMSedgetempB_ABCO1.z
    );

    // find - A from Cell ABCO1
    var formMSedgetempA_ABCO1 = subVecUpdated(forcePtA, ForceO1)
    var forceMSptA_ABCO1 = new THREE.Vector3(
        forceMSptO1_ABCO1.x - (sliderSize - minkS * minkscale.l) * formMSedgetempA_ABCO1.x,
        forceMSptO1_ABCO1.y - (sliderSize - minkS * minkscale.l) * formMSedgetempA_ABCO1.y,
        forceMSptO1_ABCO1.z - (sliderSize - minkS * minkscale.l) * formMSedgetempA_ABCO1.z
    );

    // find - C from Cell ABCO1
    var formMSedgetempC_ABCO1 = subVecUpdated(forcePtC, ForceO1)
    var forceMSptC_ABCO1 = new THREE.Vector3(
        forceMSptO1_ABCO1.x - (sliderSize - minkS * minkscale.l) * formMSedgetempC_ABCO1.x,
        forceMSptO1_ABCO1.y - (sliderSize - minkS * minkscale.l) * formMSedgetempC_ABCO1.y,
        forceMSptO1_ABCO1.z - (sliderSize - minkS * minkscale.l) * formMSedgetempC_ABCO1.z
    );

    const forceMSedgeBO1_ABCO1 = createCylinderMesh(forceMSptO1_ABCO1, forceMSptB_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeBO1_ABCO1)

    const forceMSedgeAO1_ABCO1 = createCylinderMesh(forceMSptO1_ABCO1, forceMSptA_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAO1_ABCO1)

    const forceMSedgeCO1_ABCO1 = createCylinderMesh(forceMSptO1_ABCO1, forceMSptC_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCO1_ABCO1)

    const forceMSedgeAB_ABCO1 = createCylinderMesh(forceMSptA_ABCO1, forceMSptB_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAB_ABCO1)

    const forceMSedgeBC_ABCO1 = createCylinderMesh(forceMSptB_ABCO1, forceMSptC_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeBC_ABCO1)

    const forceMSedgeAC_ABCO1 = createCylinderMesh(forceMSptA_ABCO1, forceMSptC_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAC_ABCO1)

    // project to BtPt1 from Cell ABCO1
    // project from Pt A
    var formMSedgetempA_BtPt1_ABCO1 = subVecUpdated(formPtO1new, formBtPt1)
    var forceMSptA_BtPt1_ABCO1 = new THREE.Vector3(
        forceMSptA_ABCO1.x + (1.7 * minkS * minkscale.l) * formMSedgetempA_BtPt1_ABCO1.x,
        forceMSptA_ABCO1.y + (1.7 * minkS * minkscale.l) * formMSedgetempA_BtPt1_ABCO1.y,
        forceMSptA_ABCO1.z + (1.7 * minkS * minkscale.l) * formMSedgetempA_BtPt1_ABCO1.z
    );
    const forceMSedgeAA__BtPt1_ABCO1 = createCylinderMesh(forceMSptA_ABCO1, forceMSptA_BtPt1_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAA__BtPt1_ABCO1)

    // project from Pt B
    var formMSedgetempB_BtPt1_ABCO1 = subVecUpdated(formPtO1new, formBtPt1)
    var forceMSptB_BtPt1_ABCO1 = new THREE.Vector3(
        forceMSptB_ABCO1.x + (1.7 * minkS * minkscale.l) * formMSedgetempB_BtPt1_ABCO1.x,
        forceMSptB_ABCO1.y + (1.7 * minkS * minkscale.l) * formMSedgetempB_BtPt1_ABCO1.y,
        forceMSptB_ABCO1.z + (1.7 * minkS * minkscale.l) * formMSedgetempB_BtPt1_ABCO1.z
    );
    const forceMSedgeBB__BtPt1_ABCO1 = createCylinderMesh(forceMSptB_ABCO1, forceMSptB_BtPt1_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeBB__BtPt1_ABCO1)

    // project from Pt O1
    var formMSedgetempO1_BtPt1_ABCO1 = subVecUpdated(formPtO1new, formBtPt1)
    var forceMSptO1_BtPt1_ABCO1 = new THREE.Vector3(
        forceMSptO1_ABCO1.x + (1.7 * minkS * minkscale.l) * formMSedgetempO1_BtPt1_ABCO1.x,
        forceMSptO1_ABCO1.y + (1.7 * minkS * minkscale.l) * formMSedgetempO1_BtPt1_ABCO1.y,
        forceMSptO1_ABCO1.z + (1.7 * minkS * minkscale.l) * formMSedgetempO1_BtPt1_ABCO1.z
    );
    const forceMSedgeO1O1__BtPt1_ABCO1 = createCylinderMesh(forceMSptO1_ABCO1, forceMSptO1_BtPt1_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeO1O1__BtPt1_ABCO1)

    // connect rest of edges - BtPt 1
    const forceMSedgeAB__BtPt1_ABCO1 = createCylinderMesh(forceMSptA_BtPt1_ABCO1, forceMSptB_BtPt1_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAB__BtPt1_ABCO1)
    const forceMSedgeAO1__BtPt1_ABCO1 = createCylinderMesh(forceMSptA_BtPt1_ABCO1, forceMSptO1_BtPt1_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAO1__BtPt1_ABCO1)
    const forceMSedgeBO1__BtPt1_ABCO1 = createCylinderMesh(forceMSptB_BtPt1_ABCO1, forceMSptO1_BtPt1_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeBO1__BtPt1_ABCO1)

    // project to BtPt2 from Cell ABCO1
    // project from Pt B
    var formMSedgetempB_BtPt2_ABCO1 = subVecUpdated(formPtO1new, formBtPt2)
    var forceMSptB_BtPt2_ABCO1 = new THREE.Vector3(
        forceMSptB_ABCO1.x + (1.7 * minkS * minkscale.l) * formMSedgetempB_BtPt2_ABCO1.x,
        forceMSptB_ABCO1.y + (1.7 * minkS * minkscale.l) * formMSedgetempB_BtPt2_ABCO1.y,
        forceMSptB_ABCO1.z + (1.7 * minkS * minkscale.l) * formMSedgetempB_BtPt2_ABCO1.z
    );
    const forceMSedgeBB__BtPt2_ABCO1 = createCylinderMesh(forceMSptB_ABCO1, forceMSptB_BtPt2_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeBB__BtPt2_ABCO1)

    // project from Pt C
    var formMSedgetempC_BtPt2_ABCO1 = subVecUpdated(formPtO1new, formBtPt2)
    var forceMSptC_BtPt2_ABCO1 = new THREE.Vector3(
        forceMSptC_ABCO1.x + (1.7 * minkS * minkscale.l) * formMSedgetempC_BtPt2_ABCO1.x,
        forceMSptC_ABCO1.y + (1.7 * minkS * minkscale.l) * formMSedgetempC_BtPt2_ABCO1.y,
        forceMSptC_ABCO1.z + (1.7 * minkS * minkscale.l) * formMSedgetempC_BtPt2_ABCO1.z
    );
    const forceMSedgeCC__BtPt2_ABCO1 = createCylinderMesh(forceMSptC_ABCO1, forceMSptC_BtPt2_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCC__BtPt2_ABCO1)

    // project from Pt O1
    var formMSedgetempO1_BtPt2_ABCO1 = subVecUpdated(formPtO1new, formBtPt2)
    var forceMSptO1_BtPt2_ABCO1 = new THREE.Vector3(
        forceMSptO1_ABCO1.x + (1.7 * minkS * minkscale.l) * formMSedgetempO1_BtPt2_ABCO1.x,
        forceMSptO1_ABCO1.y + (1.7 * minkS * minkscale.l) * formMSedgetempO1_BtPt2_ABCO1.y,
        forceMSptO1_ABCO1.z + (1.7 * minkS * minkscale.l) * formMSedgetempO1_BtPt2_ABCO1.z
    );
    const forceMSedgeO1O1__BtPt2_ABCO1 = createCylinderMesh(forceMSptO1_ABCO1, forceMSptO1_BtPt2_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeO1O1__BtPt2_ABCO1)

    // connect rest of edges - BtPt 2
    const forceMSedgeBC__BtPt2_ABCO1 = createCylinderMesh(forceMSptB_BtPt2_ABCO1, forceMSptC_BtPt2_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeBC__BtPt2_ABCO1)
    const forceMSedgeBO1__BtPt2_ABCO1 = createCylinderMesh(forceMSptB_BtPt2_ABCO1, forceMSptO1_BtPt2_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeBO1__BtPt2_ABCO1)
    const forceMSedgeCO1__BtPt2_ABCO1 = createCylinderMesh(forceMSptC_BtPt2_ABCO1, forceMSptO1_BtPt2_ABCO1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCO1__BtPt2_ABCO1)

    //******************* 2. - Cell ACO1O2 （new) *******************

    // project from cell ABCO1 to cell ACO1O2
    // point A - cell ACO1O2
    var formMSedgetempA_ACO1O2 = subVecUpdated(formPtO1new, formPtO3new)
    var forceMSptA_ACO1O2 = new THREE.Vector3(
        forceMSptA_ABCO1.x + (1.7 * minkS * minkscale.l) * formMSedgetempA_ACO1O2.x,
        forceMSptA_ABCO1.y + (1.7 * minkS * minkscale.l) * formMSedgetempA_ACO1O2.y,
        forceMSptA_ABCO1.z + (1.7 * minkS * minkscale.l) * formMSedgetempA_ACO1O2.z
    );
    const forceMSedgeAA_ABCO1_ACO1O2 = createCylinderMesh(forceMSptA_ABCO1, forceMSptA_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAA_ABCO1_ACO1O2)

    // point O1 - cell ACO1O2
    var formMSedgetempO1_ACO1O2 = subVecUpdated(formPtO1new, formPtO3new)
    var forceMSptO1_ACO1O2 = new THREE.Vector3(
        forceMSptO1_ABCO1.x + (1.7 * minkS * minkscale.l) * formMSedgetempO1_ACO1O2.x,
        forceMSptO1_ABCO1.y + (1.7 * minkS * minkscale.l) * formMSedgetempO1_ACO1O2.y,
        forceMSptO1_ABCO1.z + (1.7 * minkS * minkscale.l) * formMSedgetempO1_ACO1O2.z
    );
    const forceMSedgeO1O1_ABCO1_ACO1O2 = createCylinderMesh(forceMSptO1_ABCO1, forceMSptO1_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeO1O1_ABCO1_ACO1O2)

    // point C - cell ACO1O2
    var formMSedgetempC_ACO1O2 = subVecUpdated(formPtO1new, formPtO3new)
    var forceMSptC_ACO1O2 = new THREE.Vector3(
        forceMSptC_ABCO1.x + (1.7 * minkS * minkscale.l) * formMSedgetempC_ACO1O2.x,
        forceMSptC_ABCO1.y + (1.7 * minkS * minkscale.l) * formMSedgetempC_ACO1O2.y,
        forceMSptC_ABCO1.z + (1.7 * minkS * minkscale.l) * formMSedgetempC_ACO1O2.z
    );
    const forceMSedgeCC_ABCO1_ACO1O2 = createCylinderMesh(forceMSptC_ABCO1, forceMSptC_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCC_ABCO1_ACO1O2)

    // point O2 - cell ACO1O2 *********** important ************
    var formMSedgetempO2_ACO1O2 = subVecUpdated(ForceO2, ForceO1)
    var forceMSptO2_ACO1O2 = new THREE.Vector3(
        forceMSptO1_ACO1O2.x - (sliderSize - minkS * minkscale.l) * formMSedgetempO2_ACO1O2.x,
        forceMSptO1_ACO1O2.y - (sliderSize - minkS * minkscale.l) * formMSedgetempO2_ACO1O2.y,
        forceMSptO1_ACO1O2.z - (sliderSize - minkS * minkscale.l) * formMSedgetempO2_ACO1O2.z
    );

    // connect rest of edges - cell ACO1O2
    const forceMSedgeO1O2_ACO1O2 = createCylinderMesh(forceMSptO1_ACO1O2, forceMSptO2_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeO1O2_ACO1O2)
    const forceMSedgeAO1_ACO1O2 = createCylinderMesh(forceMSptA_ACO1O2, forceMSptO1_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAO1_ACO1O2)
    const forceMSedgeAO2_ACO1O2 = createCylinderMesh(forceMSptA_ACO1O2, forceMSptO2_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAO2_ACO1O2)
    const forceMSedgeAC_ACO1O2 = createCylinderMesh(forceMSptA_ACO1O2, forceMSptC_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAC_ACO1O2)
    const forceMSedgeCO1_ACO1O2 = createCylinderMesh(forceMSptC_ACO1O2, forceMSptO1_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCO1_ACO1O2)
    const forceMSedgeCO2_ACO1O2 = createCylinderMesh(forceMSptC_ACO1O2, forceMSptO2_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCO2_ACO1O2)

    // project to BtPt2 from Cell ACO1O2
    // project from Pt C
    var formMSedgetempC_BtPt2_ACO1O2 = subVecUpdated(formPtO3new, formBtPt2)
    var forceMSptC_BtPt2_ACO1O2 = new THREE.Vector3(
        forceMSptC_ACO1O2.x + (1.7 * minkS * minkscale.l) * formMSedgetempC_BtPt2_ACO1O2.x,
        forceMSptC_ACO1O2.y + (1.7 * minkS * minkscale.l) * formMSedgetempC_BtPt2_ACO1O2.y,
        forceMSptC_ACO1O2.z + (1.7 * minkS * minkscale.l) * formMSedgetempC_BtPt2_ACO1O2.z
    );
    const forceMSedgeCC__BtPt2_ACO1O2 = createCylinderMesh(forceMSptC_ACO1O2, forceMSptC_BtPt2_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCC__BtPt2_ACO1O2)

    // project from Pt O1
    var formMSedgetempO1_BtPt2_ACO1O2 = subVecUpdated(formPtO3new, formBtPt2)
    var forceMSptO1_BtPt2_ACO1O2 = new THREE.Vector3(
        forceMSptO1_ACO1O2.x + (1.7 * minkS * minkscale.l) * formMSedgetempO1_BtPt2_ACO1O2.x,
        forceMSptO1_ACO1O2.y + (1.7 * minkS * minkscale.l) * formMSedgetempO1_BtPt2_ACO1O2.y,
        forceMSptO1_ACO1O2.z + (1.7 * minkS * minkscale.l) * formMSedgetempO1_BtPt2_ACO1O2.z
    );
    const forceMSedgeO1O1__BtPt2_ACO1O2 = createCylinderMesh(forceMSptO1_ACO1O2, forceMSptO1_BtPt2_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeO1O1__BtPt2_ACO1O2)

    // project from Pt O2
    var formMSedgetempO2_BtPt2_ACO1O2 = subVecUpdated(formPtO3new, formBtPt2)
    var forceMSptO2_BtPt2_ACO1O2 = new THREE.Vector3(
        forceMSptO2_ACO1O2.x + (1.7 * minkS * minkscale.l) * formMSedgetempO2_BtPt2_ACO1O2.x,
        forceMSptO2_ACO1O2.y + (1.7 * minkS * minkscale.l) * formMSedgetempO2_BtPt2_ACO1O2.y,
        forceMSptO2_ACO1O2.z + (1.7 * minkS * minkscale.l) * formMSedgetempO2_BtPt2_ACO1O2.z
    );
    const forceMSedgeO2O2__BtPt2_ACO1O2 = createCylinderMesh(forceMSptO2_ACO1O2, forceMSptO2_BtPt2_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeO2O2__BtPt2_ACO1O2)

    // connect rest edges
    const forceMSedgeO1O2__BtPt2_ACO1O2 = createCylinderMesh(forceMSptO1_BtPt2_ACO1O2, forceMSptO2_BtPt2_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeO1O2__BtPt2_ACO1O2)
    const forceMSedgeCO2__BtPt2_ACO1O2 = createCylinderMesh(forceMSptC_BtPt2_ACO1O2, forceMSptO2_BtPt2_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCO2__BtPt2_ACO1O2)

    // project to BtPt4 from Cell ACO1O2
    // project from Pt A
    var formMSedgetempA_BtPt4_ACO1O2 = subVecUpdated(formPtO3new, formBtPt4)
    var forceMSptA_BtPt4_ACO1O2 = new THREE.Vector3(
        forceMSptA_ACO1O2.x + (1.7 * minkS * minkscale.l) * formMSedgetempA_BtPt4_ACO1O2.x,
        forceMSptA_ACO1O2.y + (1.7 * minkS * minkscale.l) * formMSedgetempA_BtPt4_ACO1O2.y,
        forceMSptA_ACO1O2.z + (1.7 * minkS * minkscale.l) * formMSedgetempA_BtPt4_ACO1O2.z
    );
    const forceMSedgeAA__BtPt4_ACO1O2 = createCylinderMesh(forceMSptA_ACO1O2, forceMSptA_BtPt4_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAA__BtPt4_ACO1O2)

    // project from Pt O1
    var formMSedgetempO1_BtPt4_ACO1O2 = subVecUpdated(formPtO3new, formBtPt4)
    var forceMSptO1_BtPt4_ACO1O2 = new THREE.Vector3(
        forceMSptO1_ACO1O2.x + (1.7 * minkS * minkscale.l) * formMSedgetempO1_BtPt4_ACO1O2.x,
        forceMSptO1_ACO1O2.y + (1.7 * minkS * minkscale.l) * formMSedgetempO1_BtPt4_ACO1O2.y,
        forceMSptO1_ACO1O2.z + (1.7 * minkS * minkscale.l) * formMSedgetempO1_BtPt4_ACO1O2.z
    );
    const forceMSedgeO1O1__BtPt4_ACO1O2 = createCylinderMesh(forceMSptO1_ACO1O2, forceMSptO1_BtPt4_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeO1O1__BtPt4_ACO1O2)

    // project from Pt O2
    var formMSedgetempO2_BtPt4_ACO1O2 = subVecUpdated(formPtO3new, formBtPt4)
    var forceMSptO2_BtPt4_ACO1O2 = new THREE.Vector3(
        forceMSptO2_ACO1O2.x + (1.7 * minkS * minkscale.l) * formMSedgetempO2_BtPt4_ACO1O2.x,
        forceMSptO2_ACO1O2.y + (1.7 * minkS * minkscale.l) * formMSedgetempO2_BtPt4_ACO1O2.y,
        forceMSptO2_ACO1O2.z + (1.7 * minkS * minkscale.l) * formMSedgetempO2_BtPt4_ACO1O2.z
    );
    const forceMSedgeO2O2__BtPt4_ACO1O2 = createCylinderMesh(forceMSptO2_ACO1O2, forceMSptO2_BtPt4_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeO2O2__BtPt4_ACO1O2)

    // connect rest edges
    const forceMSedgeO1O2__BtPt4_ACO1O2 = createCylinderMesh(forceMSptO1_BtPt4_ACO1O2, forceMSptO2_BtPt4_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeO1O2__BtPt4_ACO1O2)
    const forceMSedgeAO2__BtPt4_ACO1O2 = createCylinderMesh(forceMSptA_BtPt4_ACO1O2, forceMSptO2_BtPt4_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAO2__BtPt4_ACO1O2)
    const forceMSedgeAO1__BtPt4_ACO1O2 = createCylinderMesh(forceMSptA_BtPt4_ACO1O2, forceMSptO1_BtPt4_ACO1O2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAO1__BtPt4_ACO1O2)

    //******************* 3. - Cell ACDO2 （new) *******************

    // project from cell ACO1O2 to cell ACDO2
    // point A - cell ACDO2
    var formMSedgetempA_ACDO2 = subVecUpdated(formPtO3new, formPtO2new)
    var forceMSptA_ACDO2 = new THREE.Vector3(
        forceMSptA_ACO1O2.x + (1.7 * minkS * minkscale.l) * formMSedgetempA_ACDO2.x,
        forceMSptA_ACO1O2.y + (1.7 * minkS * minkscale.l) * formMSedgetempA_ACDO2.y,
        forceMSptA_ACO1O2.z + (1.7 * minkS * minkscale.l) * formMSedgetempA_ACDO2.z
    );
    const forceMSedgeAA_ACO1O2_ACDO2 = createCylinderMesh(forceMSptA_ACO1O2, forceMSptA_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAA_ACO1O2_ACDO2)

    // point C - cell ACDO2
    var formMSedgetempC_ACDO2 = subVecUpdated(formPtO3new, formPtO2new)
    var forceMSptC_ACDO2 = new THREE.Vector3(
        forceMSptC_ACO1O2.x + (1.7 * minkS * minkscale.l) * formMSedgetempC_ACDO2.x,
        forceMSptC_ACO1O2.y + (1.7 * minkS * minkscale.l) * formMSedgetempC_ACDO2.y,
        forceMSptC_ACO1O2.z + (1.7 * minkS * minkscale.l) * formMSedgetempC_ACDO2.z
    );
    const forceMSedgeCC_ACO1O2_ACDO2 = createCylinderMesh(forceMSptC_ACO1O2, forceMSptC_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCC_ACO1O2_ACDO2)

    // point o2 - cell ACDO2
    var formMSedgetempO2_ACDO2 = subVecUpdated(formPtO3new, formPtO2new)
    var forceMSptO2_ACDO2 = new THREE.Vector3(
        forceMSptO2_ACO1O2.x + (1.7 * minkS * minkscale.l) * formMSedgetempO2_ACDO2.x,
        forceMSptO2_ACO1O2.y + (1.7 * minkS * minkscale.l) * formMSedgetempO2_ACDO2.y,
        forceMSptO2_ACO1O2.z + (1.7 * minkS * minkscale.l) * formMSedgetempO2_ACDO2.z
    );
    const forceMSedgeO2O2_ACO1O2_ACDO2 = createCylinderMesh(forceMSptO2_ACO1O2, forceMSptO2_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeO2O2_ACO1O2_ACDO2)

    // point O2 - cell ACDO2 *********** important ************
    var formMSedgetempD_ACDO2 = subVecUpdated(forcePtD, ForceO2)
    var forceMSptD_ACDO2 = new THREE.Vector3(
        forceMSptO2_ACDO2.x - (sliderSize - minkS * minkscale.l) * formMSedgetempD_ACDO2.x,
        forceMSptO2_ACDO2.y - (sliderSize - minkS * minkscale.l) * formMSedgetempD_ACDO2.y,
        forceMSptO2_ACDO2.z - (sliderSize - minkS * minkscale.l) * formMSedgetempD_ACDO2.z
    );
    const forceMSedgeDO2_ACDO2 = createCylinderMesh(forceMSptD_ACDO2, forceMSptO2_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeDO2_ACDO2)

    const forceMSedgeAO2_ACDO2 = createCylinderMesh(forceMSptA_ACDO2, forceMSptO2_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAO2_ACDO2)
    const forceMSedgeCO2_ACDO2 = createCylinderMesh(forceMSptC_ACDO2, forceMSptO2_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCO2_ACDO2)

    const forceMSedgeAC_ACDO2 = createCylinderMesh(forceMSptC_ACDO2, forceMSptA_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAC_ACDO2)
    const forceMSedgeAD_ACDO2 = createCylinderMesh(forceMSptD_ACDO2, forceMSptA_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAD_ACDO2)
    const forceMSedgeCD_ACDO2 = createCylinderMesh(forceMSptD_ACDO2, forceMSptC_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCD_ACDO2)

    // project to BtPt4 from Cell ACDO2
    // project from Pt A
    var formMSedgetempA_BtPt4_ACDO2 = subVecUpdated(formPtO2new, formBtPt4)
    var forceMSptA_BtPt4_ACDO2 = new THREE.Vector3(
        forceMSptA_ACDO2.x + (1.7 * minkS * minkscale.l) * formMSedgetempA_BtPt4_ACDO2.x,
        forceMSptA_ACDO2.y + (1.7 * minkS * minkscale.l) * formMSedgetempA_BtPt4_ACDO2.y,
        forceMSptA_ACDO2.z + (1.7 * minkS * minkscale.l) * formMSedgetempA_BtPt4_ACDO2.z
    );
    const forceMSedgeAA__BtPt4_ACDO2 = createCylinderMesh(forceMSptA_ACDO2, forceMSptA_BtPt4_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAA__BtPt4_ACDO2)

    // project from Pt D
    var formMSedgetempD_BtPt4_ACDO2 = subVecUpdated(formPtO2new, formBtPt4)
    var forceMSptD_BtPt4_ACDO2 = new THREE.Vector3(
        forceMSptD_ACDO2.x + (1.7 * minkS * minkscale.l) * formMSedgetempD_BtPt4_ACDO2.x,
        forceMSptD_ACDO2.y + (1.7 * minkS * minkscale.l) * formMSedgetempD_BtPt4_ACDO2.y,
        forceMSptD_ACDO2.z + (1.7 * minkS * minkscale.l) * formMSedgetempD_BtPt4_ACDO2.z
    );
    const forceMSedgeDD__BtPt4_ACDO2 = createCylinderMesh(forceMSptD_ACDO2, forceMSptD_BtPt4_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeDD__BtPt4_ACDO2)

    // project from Pt O2
    var formMSedgetempO2_BtPt4_ACDO2 = subVecUpdated(formPtO2new, formBtPt4)
    var forceMSptO2_BtPt4_ACDO2 = new THREE.Vector3(
        forceMSptO2_ACDO2.x + (1.7 * minkS * minkscale.l) * formMSedgetempO2_BtPt4_ACDO2.x,
        forceMSptO2_ACDO2.y + (1.7 * minkS * minkscale.l) * formMSedgetempO2_BtPt4_ACDO2.y,
        forceMSptO2_ACDO2.z + (1.7 * minkS * minkscale.l) * formMSedgetempO2_BtPt4_ACDO2.z
    );
    const forceMSedgeO2O2__BtPt4_ACDO2 = createCylinderMesh(forceMSptO2_ACDO2, forceMSptO2_BtPt4_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeO2O2__BtPt4_ACDO2)

    // connect rest edges
    const forceMSedgeDO2__BtPt4_ACDO2 = createCylinderMesh(forceMSptD_BtPt4_ACDO2, forceMSptO2_BtPt4_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeDO2__BtPt4_ACDO2)
    const forceMSedgeAD__BtPt4_ACDO2 = createCylinderMesh(forceMSptD_BtPt4_ACDO2, forceMSptA_BtPt4_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAD__BtPt4_ACDO2)

    // project to BtPt3 from Cell ACDO2
    // project from Pt C
    var formMSedgetempC_BtPt3_ACDO2 = subVecUpdated(formPtO2new, formBtPt3)
    var forceMSptC_BtPt3_ACDO2 = new THREE.Vector3(
        forceMSptC_ACDO2.x + (1.7 * minkS * minkscale.l) * formMSedgetempC_BtPt3_ACDO2.x,
        forceMSptC_ACDO2.y + (1.7 * minkS * minkscale.l) * formMSedgetempC_BtPt3_ACDO2.y,
        forceMSptC_ACDO2.z + (1.7 * minkS * minkscale.l) * formMSedgetempC_BtPt3_ACDO2.z
    );
    const forceMSedgeCC__BtPt3_ACDO2 = createCylinderMesh(forceMSptC_ACDO2, forceMSptC_BtPt3_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCC__BtPt3_ACDO2)

    // project from Pt D
    var formMSedgetempD_BtPt3_ACDO2 = subVecUpdated(formPtO2new, formBtPt3)
    var forceMSptD_BtPt3_ACDO2 = new THREE.Vector3(
        forceMSptD_ACDO2.x + (1.7 * minkS * minkscale.l) * formMSedgetempD_BtPt3_ACDO2.x,
        forceMSptD_ACDO2.y + (1.7 * minkS * minkscale.l) * formMSedgetempD_BtPt3_ACDO2.y,
        forceMSptD_ACDO2.z + (1.7 * minkS * minkscale.l) * formMSedgetempD_BtPt3_ACDO2.z
    );
    const forceMSedgeDD__BtPt3_ACDO2 = createCylinderMesh(forceMSptD_ACDO2, forceMSptD_BtPt3_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeDD__BtPt3_ACDO2)

    // project from Pt O2
    var formMSedgetempO2_BtPt3_ACDO2 = subVecUpdated(formPtO2new, formBtPt3)
    var forceMSptO2_BtPt3_ACDO2 = new THREE.Vector3(
        forceMSptO2_ACDO2.x + (1.7 * minkS * minkscale.l) * formMSedgetempO2_BtPt3_ACDO2.x,
        forceMSptO2_ACDO2.y + (1.7 * minkS * minkscale.l) * formMSedgetempO2_BtPt3_ACDO2.y,
        forceMSptO2_ACDO2.z + (1.7 * minkS * minkscale.l) * formMSedgetempO2_BtPt3_ACDO2.z
    );
    const forceMSedgeO2O2__BtPt3_ACDO2 = createCylinderMesh(forceMSptO2_ACDO2, forceMSptO2_BtPt3_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeO2O2__BtPt3_ACDO2)

    // connect rest edges
    const forceMSedgeDO2__BtPt3_ACDO2 = createCylinderMesh(forceMSptD_BtPt3_ACDO2, forceMSptO2_BtPt3_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeDO2__BtPt3_ACDO2)
    const forceMSedgeCO2__BtPt3_ACDO2 = createCylinderMesh(forceMSptC_BtPt3_ACDO2, forceMSptO2_BtPt3_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCO2__BtPt3_ACDO2)
    const forceMSedgeCD__BtPt3_ACDO2 = createCylinderMesh(forceMSptC_BtPt3_ACDO2, forceMSptD_BtPt3_ACDO2, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCD__BtPt3_ACDO2)

    // add faces to the force diagram

    var formedgeColor1, formedgeColor2, formedgeColor3, formedgeColor4, formedgeColor5, formedgeColor6,
        formedgeColor7, formedgeColor8;

    // triangle ABO1 - 1
    var normalABO1_a = subVec(forcePtB, forcePtA)
    var normalABO1_b = subVec(forcePtA, ForceO1)
    var normalABO1 = cross(normalABO1_a, normalABO1_b)
    var edgePt1O1 = subVec(formBtPt1, formPtO1new);
    var resultPt1O1 = normalABO1.dot(edgePt1O1);

    if (resultPt1O1 < 0) {
        if (areaABO1 / areaMax >= 0.75) {
            formedgeColor1 = 0x0F3150
        }
        if (0.5 <= areaABO1 / areaMax && areaABO1 / areaMax < 0.75) {
            formedgeColor1 = 0x05416D
        }
        if (0.25 <= areaABO1 / areaMax && areaABO1 / areaMax < 0.5) {
            formedgeColor1 = 0x376D9B
        }
        if (0 <= areaABO1 / areaMax && areaABO1 / areaMax < 0.25) {
            formedgeColor1 = 0x5B84AE
        }
    } else {
        if (areaABO1 / areaMax >= 0.75) {
            formedgeColor1 = 0x80002F
        }
        if (0.5 <= areaABO1 / areaMax && areaABO1 / areaMax < 0.75) {
            formedgeColor1 = 0x940041
        }
        if (0.25 <= areaABO1 / areaMax && areaABO1 / areaMax < 0.5) {
            formedgeColor1 = 0xCC0549
        }
        if (0 <= areaABO1 / areaMax && areaABO1 / areaMax < 0.25) {
            formedgeColor1 = 0xD72F62
        }
    }

    // triangle BCO1 -2
    var normalBCO1_a = subVec(forcePtC, forcePtB)
    var normalBCO1_b = subVec(forcePtB, ForceO1)
    var normalBCO1 = cross(normalBCO1_a, normalBCO1_b)
    var edgePt2O1 = subVec(formBtPt2, formPtO1new);
    var resultPt2O1 = normalBCO1.dot(edgePt2O1)

    if (resultPt2O1 < 0) {
        if (areaBCO1 / areaMax >= 0.75) {
            formedgeColor2 = 0x0F3150
        }
        if (0.5 <= areaBCO1 / areaMax && areaBCO1 / areaMax < 0.75) {
            formedgeColor2 = 0x05416D
        }
        if (0.25 <= areaBCO1 / areaMax && areaBCO1 / areaMax < 0.5) {
            formedgeColor2 = 0x376D9B
        }
        if (0 <= areaBCO1 / areaMax && areaBCO1 / areaMax < 0.25) {
            formedgeColor2 = 0x5B84AE
        }
    } else {
        if (areaBCO1 / areaMax >= 0.75) {
            formedgeColor2 = 0x80002F
        }
        if (0.5 <= areaBCO1 / areaMax && areaBCO1 / areaMax < 0.75) {
            formedgeColor2 = 0x940041
        }
        if (0.25 <= areaBCO1 / areaMax && areaBCO1 / areaMax < 0.5) {
            formedgeColor2 = 0xCC0549
        }
        if (0 <= areaBCO1 / areaMax && areaBCO1 / areaMax < 0.25) {
            formedgeColor2 = 0xD72F62
        }
    }

    // triangle CO1O2 - 3
    var normalCO1O2_a = subVec(forcePtC, ForceO1);
    var normalCO1O2_b = subVec(ForceO1, ForceO2);
    var normalCO1O2 = cross(normalCO1O2_a, normalCO1O2_b);
    var edgePt2O3 = subVec(formBtPt2, formPtO3new);
    var resultPt2O3 = normalCO1O2.dot(edgePt2O3);

    if (resultPt2O3 < 0) {
        if (areaCO1O2 / areaMax >= 0.75) {
            formedgeColor3 = 0x0F3150
        }
        if (0.5 <= areaCO1O2 / areaMax && areaCO1O2 / areaMax < 0.75) {
            formedgeColor3 = 0x05416D
        }
        if (0.25 <= areaCO1O2 / areaMax && areaCO1O2 / areaMax < 0.5) {
            formedgeColor3 = 0x376D9B
        }
        if (0 <= areaCO1O2 / areaMax && areaCO1O2 / areaMax < 0.25) {
            formedgeColor3 = 0x5B84AE
        }
    } else {
        if (areaCO1O2 / areaMax >= 0.75) {
            formedgeColor3 = 0x80002F
        }
        if (0.5 <= areaCO1O2 / areaMax && areaCO1O2 / areaMax < 0.75) {
            formedgeColor3 = 0x940041
        }
        if (0.25 <= areaCO1O2 / areaMax && areaCO1O2 / areaMax < 0.5) {
            formedgeColor3 = 0xCC0549
        }
        if (0 <= areaCO1O2 / areaMax && areaCO1O2 / areaMax < 0.25) {
            formedgeColor3 = 0xD72F62
        }
    }

    // triangle ACO1 - 4
    var normalACO1_a = subVec(forcePtC, forcePtA);
    var normalACO1_b = subVec(forcePtA, ForceO1);
    var normalACO1 = cross(normalACO1_a, normalACO1_b);
    var edgePtO1O3 = subVec(formPtO1new, formPtO3new);
    var resultPtO1O3 = normalACO1.dot(edgePtO1O3);

    if (resultPtO1O3 < 0) {
        if (areaACO1 / areaMax >= 0.75) {
            formedgeColor4 = 0x0F3150
        }
        if (0.5 <= areaACO1 / areaMax && areaACO1 / areaMax < 0.75) {
            formedgeColor4 = 0x05416D
        }
        if (0.25 <= areaACO1 / areaMax && areaACO1 / areaMax < 0.5) {
            formedgeColor4 = 0x376D9B
        }
        if (0 <= areaACO1 / areaMax && areaACO1 / areaMax < 0.25) {
            formedgeColor4 = 0x5B84AE
        }
    } else {
        if (areaACO1 / areaMax >= 0.75) {
            formedgeColor4 = 0x80002F
        }
        if (0.5 <= areaACO1 / areaMax && areaACO1 / areaMax < 0.75) {
            formedgeColor4 = 0x940041
        }
        if (0.25 <= areaACO1 / areaMax && areaACO1 / areaMax < 0.5) {
            formedgeColor4 = 0xCC0549
        }
        if (0 <= areaACO1 / areaMax && areaACO1 / areaMax < 0.25) {
            formedgeColor4 = 0xD72F62
        }
    }

    // triangle AO1O2 - 5
    var normalAO1O2_a = subVec(forcePtA, ForceO2);
    var normalAO1O2_b = subVec(ForceO2, ForceO1);
    var normalAO1O2 = cross(normalAO1O2_a, normalAO1O2_b);
    var edgePt4O3 = subVec(formBtPt4, formPtO3new);
    var resultPt4O3 = normalAO1O2.dot(edgePt4O3);

    if (resultPt4O3 < 0) {
        if (areaAO1O2 / areaMax >= 0.75) {
            formedgeColor5 = 0x0F3150
        }
        if (0.5 <= areaAO1O2 / areaMax && areaAO1O2 / areaMax < 0.75) {
            formedgeColor5 = 0x05416D
        }
        if (0.25 <= areaAO1O2 / areaMax && areaAO1O2 / areaMax < 0.5) {
            formedgeColor5 = 0x376D9B
        }
        if (0 <= areaAO1O2 / areaMax && areaAO1O2 / areaMax < 0.25) {
            formedgeColor5 = 0x5B84AE
        }
    } else {
        if (areaAO1O2 / areaMax >= 0.75) {
            formedgeColor5 = 0x80002F
        }
        if (0.5 <= areaAO1O2 / areaMax && areaAO1O2 / areaMax < 0.75) {
            formedgeColor5 = 0x940041
        }
        if (0.25 <= areaAO1O2 / areaMax && areaAO1O2 / areaMax < 0.5) {
            formedgeColor5 = 0xCC0549
        }
        if (0 <= areaAO1O2 / areaMax && areaAO1O2 / areaMax < 0.25) {
            formedgeColor5 = 0xD72F62
        }
    }

    // triangle ACO2 - 6
    var normalACO2_a = subVec(forcePtA, forcePtC);
    var normalACO2_b = subVec(forcePtC, ForceO2);
    var normalACO2 = cross(normalACO2_a, normalACO2_b);
    var edgePtO2O3 = subVec(formPtO2new, formPtO3new);
    var resultPtO2O3 = normalACO2.dot(edgePtO2O3);

    if (resultPtO2O3 < 0) {
        if (areaACO2 / areaMax >= 0.75) {
            formedgeColor6 = 0x0F3150
        }
        if (0.5 <= areaACO2 / areaMax && areaACO2 / areaMax < 0.75) {
            formedgeColor6 = 0x05416D
        }
        if (0.25 <= areaACO2 / areaMax && areaACO2 / areaMax < 0.5) {
            formedgeColor6 = 0x376D9B
        }
        if (0 <= areaACO2 / areaMax && areaACO2 / areaMax < 0.25) {
            formedgeColor6 = 0x5B84AE
        }
    } else {
        if (areaACO2 / areaMax >= 0.75) {
            formedgeColor6 = 0x80002F
        }
        if (0.5 <= areaACO2 / areaMax && areaACO2 / areaMax < 0.75) {
            formedgeColor6 = 0x940041
        }
        if (0.25 <= areaACO2 / areaMax && areaACO2 / areaMax < 0.5) {
            formedgeColor6 = 0xCC0549
        }
        if (0 <= areaACO2 / areaMax && areaACO2 / areaMax < 0.25) {
            formedgeColor6 = 0xD72F62
        }
    }

    // triangle ADO2 - 7
    var normalADO2_a = subVec(forcePtA, forcePtD);
    var normalADO2_b = subVec(forcePtD, ForceO2);
    var normalADO2 = cross(normalADO2_a, normalADO2_b);
    var edgePt4O2 = subVec(formBtPt4, formPtO2new);
    var resultPt4O2 = normalADO2.dot(edgePt4O2);

    if (resultPt4O2 < 0) {
        if (areaADO2 / areaMax >= 0.75) {
            formedgeColor7 = 0x0F3150
        }
        if (0.5 <= areaADO2 / areaMax && areaADO2 / areaMax < 0.75) {
            formedgeColor7 = 0x05416D
        }
        if (0.25 <= areaADO2 / areaMax && areaADO2 / areaMax < 0.5) {
            formedgeColor7 = 0x376D9B
        }
        if (0 <= areaADO2 / areaMax && areaADO2 / areaMax < 0.25) {
            formedgeColor7 = 0x5B84AE
        }
    } else {
        if (areaADO2 / areaMax >= 0.75) {
            formedgeColor7 = 0x80002F
        }
        if (0.5 <= areaADO2 / areaMax && areaADO2 / areaMax < 0.75) {
            formedgeColor7 = 0x940041
        }
        if (0.25 <= areaADO2 / areaMax && areaADO2 / areaMax < 0.5) {
            formedgeColor7 = 0xCC0549
        }
        if (0 <= areaADO2 / areaMax && areaADO2 / areaMax < 0.25) {
            formedgeColor7 = 0xD72F62
        }
    }

    // triangle CDO2 - 8
    var normalCDO2_a = subVec(forcePtD, forcePtC);
    var normalCDO2_b = subVec(forcePtC, ForceO2);
    var normalCDO2 = cross(normalCDO2_a, normalCDO2_b);
    var edgePt3O2 = subVec(formBtPt3, formPtO2new);
    var resultPt3O2 = normalCDO2.dot(edgePt3O2);

    if (resultPt3O2 < 0) {
        if (areaCDO2 / areaMax >= 0.75) {
            formedgeColor8 = 0x0F3150
        }
        if (0.5 <= areaCDO2 / areaMax && areaCDO2 / areaMax < 0.75) {
            formedgeColor8 = 0x05416D
        }
        if (0.25 <= areaCDO2 / areaMax && areaCDO2 / areaMax < 0.5) {
            formedgeColor8 = 0x376D9B
        }
        if (0 <= areaCDO2 / areaMax && areaCDO2 / areaMax < 0.25) {
            formedgeColor8 = 0x5B84AE
        }
    } else {
        if (areaCDO2 / areaMax >= 0.75) {
            formedgeColor8 = 0x80002F
        }
        if (0.5 <= areaCDO2 / areaMax && areaCDO2 / areaMax < 0.75) {
            formedgeColor8 = 0x940041
        }
        if (0.25 <= areaCDO2 / areaMax && areaCDO2 / areaMax < 0.5) {
            formedgeColor8 = 0xCC0549
        }
        if (0 <= areaCDO2 / areaMax && areaCDO2 / areaMax < 0.25) {
            formedgeColor8 = 0xD72F62
        }
    }

    // 1. cell ABCO1
    // ABCO1 to BtPt1
    drawMinkForceSurf(forceMSptA_ABCO1, forceMSptB_ABCO1, forceMSptO1_ABCO1, forceMSptA_BtPt1_ABCO1, forceMSptB_BtPt1_ABCO1, forceMSptO1_BtPt1_ABCO1, formedgeColor1)
    drawMinkForceSurf(forceMSptB_ABCO1, forceMSptC_ABCO1, forceMSptO1_ABCO1, forceMSptB_BtPt2_ABCO1, forceMSptC_BtPt2_ABCO1, forceMSptO1_BtPt2_ABCO1, formedgeColor2)
    drawMinkForceSurf(forceMSptC_ABCO1, forceMSptA_ABCO1, forceMSptO1_ABCO1, forceMSptC_ACO1O2, forceMSptA_ACO1O2, forceMSptO1_ACO1O2, formedgeColor4)
    drawMinkForceSurf(forceMSptO1_ACO1O2, forceMSptC_ACO1O2, forceMSptO2_ACO1O2, forceMSptO1_BtPt2_ACO1O2, forceMSptC_BtPt2_ACO1O2, forceMSptO2_BtPt2_ACO1O2, formedgeColor3)
    drawMinkForceSurf(forceMSptO2_ACO1O2, forceMSptA_ACO1O2, forceMSptO1_ACO1O2, forceMSptO2_BtPt4_ACO1O2, forceMSptA_BtPt4_ACO1O2, forceMSptO1_BtPt4_ACO1O2, formedgeColor5)

    drawMinkForceSurf(forceMSptC_ACO1O2, forceMSptA_ACO1O2, forceMSptO2_ACO1O2, forceMSptC_ACDO2, forceMSptA_ACDO2, forceMSptO2_ACDO2, formedgeColor6)
    drawMinkForceSurf(forceMSptD_ACDO2, forceMSptA_ACDO2, forceMSptO2_ACDO2, forceMSptD_BtPt4_ACDO2, forceMSptA_BtPt4_ACDO2, forceMSptO2_BtPt4_ACDO2, formedgeColor7)
    drawMinkForceSurf(forceMSptC_ACDO2, forceMSptD_ACDO2, forceMSptO2_ACDO2, forceMSptC_BtPt3_ACDO2, forceMSptD_BtPt3_ACDO2, forceMSptO2_BtPt3_ACDO2, formedgeColor8)

    // draw green face
    const forceMinkFace_ABC = minkFace3pt(forceMSptA_ABCO1, forceMSptB_ABCO1, forceMSptC_ABCO1, 0x014F06)
    force_group_mink.add(forceMinkFace_ABC)
    const forceMinkFace_ACD = minkFace3pt(forceMSptA_ACDO2, forceMSptC_ACDO2, forceMSptD_ACDO2, 0x014F06)
    force_group_mink.add(forceMinkFace_ACD)

    var formMSline1 = createdashline(formPtO3new, formPtO2new, "grey")
    form_group_mink.add(formMSline1)
    var formMSline2 = createdashline(formPtO2new, formBtPt4, "grey")
    form_group_mink.add(formMSline2)
    var formMSline3 = createdashline(formPtO2new, formBtPt3, "grey")
    form_group_mink.add(formMSline3)

    function drawMinkSurf(formMSptA_ABCO1, formMSptB_ABCO1, formPtO1new, formMSptAO1_BtPt1, formMSptBO1_BtPt1, formBtPt1, formedgeColor1) {
        const formMinkFace_ABO1 = minkFace3pt(formMSptA_ABCO1, formMSptB_ABCO1, formPtO1new, formedgeColor1)
        form_group_mink.add(formMinkFace_ABO1)

        const formMinkFace_ABO1_1 = minkFace4pt(formMSptAO1_BtPt1, formMSptBO1_BtPt1, formMSptB_ABCO1, formMSptA_ABCO1, formedgeColor1)
        form_group_mink.add(formMinkFace_ABO1_1)
        const formMinkFace_ABO1_2 = minkFace4pt(formMSptAO1_BtPt1, formMSptA_ABCO1, formPtO1new, formBtPt1, formedgeColor1)
        form_group_mink.add(formMinkFace_ABO1_2)
        const formMinkFace_ABO1_3 = minkFace4pt(formMSptBO1_BtPt1, formBtPt1, formPtO1new, formMSptB_ABCO1, formedgeColor1)
        form_group_mink.add(formMinkFace_ABO1_3)

        const formMinkFace_ABO1_BtPt1 = minkFace3pt(formMSptAO1_BtPt1, formMSptBO1_BtPt1, formBtPt1, formedgeColor1)
        form_group_mink.add(formMinkFace_ABO1_BtPt1)
    }

    function drawMinkForceSurf(formMSptA_ABCO1, formMSptB_ABCO1, formPtO1new, formMSptAO1_BtPt1, formMSptBO1_BtPt1, formBtPt1, formedgeColor1) {
        const formMinkFace_ABO1 = minkFace3pt(formMSptA_ABCO1, formMSptB_ABCO1, formPtO1new, formedgeColor1)
        force_group_mink.add(formMinkFace_ABO1)

        const formMinkFace_ABO1_1 = minkFace4pt(formMSptAO1_BtPt1, formMSptBO1_BtPt1, formMSptB_ABCO1, formMSptA_ABCO1, formedgeColor1)
        force_group_mink.add(formMinkFace_ABO1_1)
        const formMinkFace_ABO1_2 = minkFace4pt(formMSptAO1_BtPt1, formMSptA_ABCO1, formPtO1new, formBtPt1, formedgeColor1)
        force_group_mink.add(formMinkFace_ABO1_2)
        const formMinkFace_ABO1_3 = minkFace4pt(formMSptBO1_BtPt1, formBtPt1, formPtO1new, formMSptB_ABCO1, formedgeColor1)
        force_group_mink.add(formMinkFace_ABO1_3)

        const formMinkFace_ABO1_BtPt1 = minkFace3pt(formMSptAO1_BtPt1, formMSptBO1_BtPt1, formBtPt1, formedgeColor1)
        force_group_mink.add(formMinkFace_ABO1_BtPt1)
    }

    drawMinkSurf(formMSptA_ABCO1, formMSptB_ABCO1, formPtO1new, formMSptAO1_BtPt1, formMSptBO1_BtPt1, formBtPt1, formedgeColor1)

    drawMinkSurf(formMSptB_ABCO1, formMSptC_ABCO1, formPtO1new, formMSptBO1_BtPt2, formMSptCO1_BtPt2, formBtPt2, formedgeColor2)

    drawMinkSurf(formMSptC_ABCO1, formMSptA_ABCO1, formPtO1new, formMSptC_ACO1O2, formMSptA_ACO1O2, formPtO3new, formedgeColor4)

    drawMinkSurf(formPtO3new, formMSptC_ACO1O2, formMSptO2_ACO1O2, formBtPt2, formMSptCO1_BtPt2, formMSptO2_BtPt2, formedgeColor3)

    drawMinkSurf(formMSptO2_ACO1O2, formMSptA_ACO1O2, formPtO3new, formBtPt4_mink, formMSptAO2_BtPt4, formMSptO1O2_BtPt4, formedgeColor5)

    drawMinkSurf(formMSptC_ACO1O2, formMSptA_ACO1O2, formMSptO2_ACO1O2, formMSptC_ACDO2, formMSptA_ACDO2, formPtO2new_mink, formedgeColor6)

    drawMinkSurf(formMSptD_ACDO2, formMSptA_ACDO2, formPtO2new_mink, formMSptDO2_BtPt4, formMSptAO2_BtPt4, formBtPt4_mink, formedgeColor7)

    drawMinkSurf(formMSptC_ACDO2, formMSptD_ACDO2, formPtO2new_mink, formMSptCO2_BtPt3, formMSptDO2_BtPt3, formBtPt3_mink, formedgeColor8)

    // draw green face
    const formMinkFace_ABC = minkFace3pt(formMSptA_ABCO1, formMSptB_ABCO1, formMSptC_ABCO1, 0x014F06)
    form_group_mink.add(formMinkFace_ABC)
    const formMinkFace_ACD = minkFace3pt(formMSptA_ACDO2, formMSptC_ACDO2, formMSptD_ACDO2, 0x014F06)
    form_group_mink.add(formMinkFace_ACD)

    scene.add(form_group_mink);

    scene2.add(force_group_mink);

    force_group_mink.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = minkVisibilityCheckboxParams.show;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = minkVisibilityCheckboxParams.show;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = minkVisibilityCheckboxParams.show;
        }
    });

    form_group_mink.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = minkVisibilityCheckboxParams.show;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = minkVisibilityCheckboxParams.show;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = minkVisibilityCheckboxParams.show;
        }
    });

    form_group_e.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = !minkVisibilityCheckboxParams.show;
        }
    });
    form_general.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = !minkVisibilityCheckboxParams.show;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = !minkVisibilityCheckboxParams.show;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = !minkVisibilityCheckboxParams.show;
        }
    });
    force_group_e.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = !minkVisibilityCheckboxParams.show;
        }
    });
    force_group_f.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = !minkVisibilityCheckboxParams.show;
        }
    });
    force_general.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = !minkVisibilityCheckboxParams.show;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = !minkVisibilityCheckboxParams.show;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = !minkVisibilityCheckboxParams.show;
        }
        if (obj.type === "Line") {
            obj.material.visible = !minkVisibilityCheckboxParams.show;
        }
    });
}

// *********************** redraw the form and force diagram when parametrer is changing ****************
function Redraw() {

    if (faceVisibilityCheckboxParams.face) {
        redrawFace();
    }

    if (trialVisibilityCheckboxParams.on) {
        redrawTrial();
    }

    //form groups
    scene.remove(form_group_v);
    scene.remove(form_group_e);
    scene.remove(form_group_c);
    scene.remove(form_general);

    form_group_v = new THREE.Group();
    form_group_e = new THREE.Group();
    form_group_c = new THREE.Group();
    form_general = new THREE.Group();

    //force groups
    scene2.remove(force_group_v);
    scene2.remove(force_group_f);
    scene2.remove(force_group_e);
    scene2.remove(force_group_c);
    scene2.remove(force_general);

    scene2.remove(force_text);

    force_group_v = new THREE.Group();
    force_group_f = new THREE.Group();
    force_group_e = new THREE.Group();
    force_group_c = new THREE.Group();
    force_general = new THREE.Group();
    force_text = new THREE.Group();


    // *********************** form vertices **************************

    //1nd. bottom point (movable) - bottom vertice 1
    const vertice_1 = addVerticeSup(0.04, "sp1", formBtPt1)
    Ctrl_pts[0] = vertice_1; //adding to gumball selection
    const vertice_1_out = addVerticeOutSup(0.04, vertice_1.position, 1.55);

    form_group_v.add(vertice_1);
    form_group_v.add(vertice_1_out);

    //2nd. bottom point (movable) - bottom vertice 2
    const vertice_2 = addVerticeSup(0.04, "sp2", formBtPt2)
    Ctrl_pts[1] = vertice_2; //adding to gumball selection
    const vertice_2_out = addVerticeOutSup(0.04, vertice_2.position, 1.55);

    form_group_v.add(vertice_2);
    form_group_v.add(vertice_2_out);

    //3rd. bottom point (movable) - bottom vertice 3
    const vertice_3 = addVerticeSup(0.04, "sp3", formBtPt3)
    Ctrl_pts[2] = vertice_3; //adding to gumball selection
    const vertice_3_out = addVerticeOutSup(0.04, vertice_3.position, 1.55);
    form_group_v.add(vertice_3);
    form_group_v.add(vertice_3_out);

    //4th. bottom point (movable) - bottom vertice 4
    const vertice_4 = addVerticeSup(0.04, "sp4", formBtPt4)
    Ctrl_pts[3] = vertice_4; //adding to gumball selection
    const vertice_4_out = addVerticeOutSup(0.04, vertice_4.position, 1.55);
    form_group_v.add(vertice_4);
    form_group_v.add(vertice_4_out);


    var TXformNode1 = createSpriteText('1', "", new THREE.Vector3(formBtPt1.x, formBtPt1.y, formBtPt1.z - 0.3));
    form_general.add(TXformNode1);
    var TXformNode2 = createSpriteText('2', "", new THREE.Vector3(formBtPt2.x, formBtPt2.y, formBtPt2.z - 0.3));
    form_general.add(TXformNode2);
    var TXformNode3 = createSpriteText('3', "", new THREE.Vector3(formBtPt3.x, formBtPt3.y, formBtPt3.z - 0.3));
    form_general.add(TXformNode3);
    var TXformNode4 = createSpriteText('4', "", new THREE.Vector3(formBtPt4.x, formBtPt4.y, formBtPt4.z - 0.3));
    form_general.add(TXformNode4);

    // add apply loads arrows

    var arrow_apply = new THREE.MeshPhongMaterial({color: 0x009600});
    var arrow_apply_outline = new THREE.MeshBasicMaterial({
        color: "white",
        transparent: false,
        side: THREE.BackSide
    });

    var apply_arrow1 = createCylinderArrowMesh(formPtO1, new THREE.Vector3(formPtO1.x, formPtO1.y, formPtO1.z - 0.4), arrow_apply, 0.02, 0.05, 0.56);
    var apply_arrow2 = createCylinderArrowMesh(formPtO2, new THREE.Vector3(formPtO2.x, formPtO2.y, formPtO2.z - 0.4), arrow_apply, 0.02, 0.05, 0.56);

    form_general.add(apply_arrow1);
    form_general.add(apply_arrow2);

    var apply_arrow12 = createCylinderArrowMesh(new THREE.Vector3(formPtO1.x, formPtO1.y, formPtO1.z + 0.005), new THREE.Vector3(formPtO1.x, formPtO1.y, formPtO1.z - 0.425), arrow_apply_outline, 0.025, 0.06, 0.53);
    var apply_arrow22 = createCylinderArrowMesh(new THREE.Vector3(formPtO2.x, formPtO2.y, formPtO2.z + 0.005), new THREE.Vector3(formPtO2.x, formPtO2.y, formPtO2.z - 0.425), arrow_apply_outline, 0.025, 0.06, 0.53);

    form_general.add(apply_arrow22);
    form_general.add(apply_arrow12);

    // add dash lines o1o1B, o2o2B
    var applyline_dash_form = new THREE.LineDashedMaterial({
        color: 0x009600,//color
        dashSize: 0.05,
        gapSize: 0.03,
        linewidth: 1
    });

    var apply_o1o1B = [];
    apply_o1o1B.push(formPtO1);
    apply_o1o1B.push(formPtO1b);
    var apply_1_geo = new THREE.BufferGeometry().setFromPoints(apply_o1o1B);
    var applyline_o1B = new THREE.LineSegments(apply_1_geo, applyline_dash_form);
    applyline_o1B.computeLineDistances();//compute
    form_general.add(applyline_o1B);

    var apply_o2o2B = [];
    apply_o2o2B.push(formPtO2);
    apply_o2o2B.push(formPtO2b);
    var apply_2_geo = new THREE.BufferGeometry().setFromPoints(apply_o2o2B);
    var applyline_o2B = new THREE.LineSegments(apply_2_geo, applyline_dash_form);
    applyline_o2B.computeLineDistances();//compute
    form_general.add(applyline_o2B);

    // ***********************            form faces                **************************

    //form closing plane
    //plane mesh
    var form_closingplane = FormPlane(formBtPt2, formBtPt1, formBtPt4, formBtPt3)
    form_general.add(form_closingplane);

    var formline_dash = new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.1,
        gapSize: 0.03,
        linewidth: 1

    });

    var form_linep1p2 = createdashline(formBtPt1, formBtPt2, formline_dash)
    var form_linep2p3 = createdashline(formBtPt2, formBtPt3, formline_dash)
    var form_linep2p4 = createdashline(formBtPt2, formBtPt4, formline_dash)
    var form_linep3p4 = createdashline(formBtPt3, formBtPt4, formline_dash)
    var form_linep1p4 = createdashline(formBtPt1, formBtPt4, formline_dash)

    form_general.add(form_linep1p2);
    form_general.add(form_linep2p3);
    form_general.add(form_linep2p4);
    form_general.add(form_linep3p4);
    form_general.add(form_linep1p4);

    //plane face normals
    var normal_material = new THREE.MeshPhongMaterial({color: "red"})
    var normal_outlinematerial = new THREE.MeshPhongMaterial({color: "white", side: THREE.BackSide})
    //normal 124
    var mid_p1p2p4 = new THREE.Vector3((formBtPt1.x + formBtPt2.x + formBtPt4.x) / 3, (formBtPt1.y + formBtPt2.y + formBtPt4.y) / 3, (formBtPt1.z + formBtPt2.z + formBtPt4.z) / 3)
    var vec_p1p2p4_temp = CalNormalVectorUpdated(formBtPt4, formBtPt2, formBtPt1, 1.2)
    var normal_p1p2p4 = new THREE.Vector3(mid_p1p2p4.x - 0.2 * vec_p1p2p4_temp.x, mid_p1p2p4.y - 0.2 * vec_p1p2p4_temp.y, mid_p1p2p4.z - 0.2 * vec_p1p2p4_temp.z)

    var form_normal_1 = createCylinderArrowMesh(mid_p1p2p4, normal_p1p2p4, normal_material, 0.015, 0.035, 0.55);
    var form_normal_1_outline = createCylinderArrowMesh(mid_p1p2p4, normal_p1p2p4, normal_outlinematerial, 0.018, 0.038, 0.54);

    form_general.add(form_normal_1);
    form_general.add(form_normal_1_outline);

    //normal 234
    var mid_p2p3p4 = new THREE.Vector3((formBtPt3.x + formBtPt2.x + formBtPt4.x) / 3, (formBtPt3.y + formBtPt2.y + formBtPt4.y) / 3, (formBtPt3.z + formBtPt2.z + formBtPt4.z) / 3)
    var vec_p2p3p4_temp = CalNormalVectorUpdated(formBtPt4, formBtPt3, formBtPt2, 1.2)
    var normal_p2p3p4 = new THREE.Vector3(mid_p2p3p4.x - 0.2 * vec_p2p3p4_temp.x, mid_p2p3p4.y - 0.2 * vec_p2p3p4_temp.y, mid_p2p3p4.z - 0.2 * vec_p2p3p4_temp.z)

    var form_normal_2 = createCylinderArrowMesh(mid_p2p3p4, normal_p2p3p4, normal_material, 0.015, 0.035, 0.55);
    var form_normal_2_outline = createCylinderArrowMesh(mid_p2p3p4, normal_p2p3p4, normal_outlinematerial, 0.018, 0.038, 0.54);

    form_general.add(form_normal_2);
    form_general.add(form_normal_2_outline);

    var TXapplyForce = createSpriteTextApply('f', "1", new THREE.Vector3(formPtO1.x, formPtO1.y, formPtO1.z + 0.05));
    form_general.add(TXapplyForce);


    // ***********************            force diagram            **************************
    var edgescale = 2; // size of the force diagram

    //PtA
    var forcePtA = new THREE.Vector3(1, -1.5, 0);

    //PtB
    var forcePtBtemp = CalNormalVectorUpdated(formBtPt1, formPtO1, formPtO1b, edgescale);
    var forcePtB = new THREE.Vector3(forcePtA.x - forcePtBtemp.x, forcePtA.y - forcePtBtemp.y, forcePtA.z - forcePtBtemp.z);

    //PtC
    var forcePtC1temp = CalNormalVectorUpdated(formBtPt2, formPtO1, formPtO1b, edgescale);
    var forcePtC1 = new THREE.Vector3(forcePtB.x - forcePtC1temp.x, forcePtB.y - forcePtC1temp.y, forcePtB.z - forcePtC1temp.z);
    var forcePtC2temp = CalNormalVectorUpdated(formPtO1, formPtO2, formPtO2b, edgescale);
    var forcePtC2 = new THREE.Vector3(forcePtA.x - forcePtC2temp.x, forcePtA.y - forcePtC2temp.y, forcePtA.z - forcePtC2temp.z);
    var dirBC = new THREE.Vector3(); // create once an reuse it
    dirBC.subVectors(forcePtB, forcePtC1).normalize();
    var dirAC = new THREE.Vector3(); // create once an reuse it
    dirAC.subVectors(forcePtC2, forcePtA).normalize();

    var forcePtC = LinesSectPt(dirBC, forcePtB, dirAC, forcePtA);

    //PtD
    var forcePtD1temp = CalNormalVectorUpdated(formBtPt3, formPtO2, formPtO2b, edgescale);
    var forcePtD1 = new THREE.Vector3(forcePtC.x - forcePtD1temp.x, forcePtC.y - forcePtD1temp.y, forcePtC.z - forcePtD1temp.z);
    var forcePtD2temp = CalNormalVectorUpdated(formPtO2, formBtPt4, formPtO2b, edgescale);
    var forcePtD2 = new THREE.Vector3(forcePtA.x - forcePtD2temp.x, forcePtA.y - forcePtD2temp.y, forcePtA.z - forcePtD2temp.z);

    var dirCD = new THREE.Vector3(); // create once an reuse it
    dirCD.subVectors(forcePtC, forcePtD1).normalize();
    var dirAD = new THREE.Vector3(); // create once an reuse it
    dirAD.subVectors(forcePtD2, forcePtA).normalize();
    var forcePtD = LinesSectPt(dirCD, forcePtC, dirAD, forcePtA);

    //force edges
    var edgeSize = 0.005;
    var edgeColor = "lightgrey";

    var forceEdgeMaterial = new THREE.MeshPhongMaterial({
        color: edgeColor
    });

    const forceEdgeAB = createCylinderMesh(forcePtA, forcePtB, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeAB);

    const forceEdgeAC = createCylinderMesh(forcePtA, forcePtC, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeAC);

    const forceEdgeBC = createCylinderMesh(forcePtB, forcePtC, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeBC)

    const forceEdgeAD = createCylinderMesh(forcePtA, forcePtD, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeAD)

    const forceEdgeCD = createCylinderMesh(forcePtC, forcePtD, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeCD)

    var applyForceArrowMaterial = new THREE.MeshPhongMaterial({
        color: 0x009600//green
    });

    var applyForceArrowMaterialOut = new THREE.MeshPhongMaterial({
        color: "white",
        transparent: false,
        side: THREE.BackSide
    });
    const applyArrow = createCylinderArrowMesh(
        new THREE.Vector3(
            face_center(forcePtA, forcePtB, forcePtC).x,
            face_center(forcePtA, forcePtB, forcePtC).y,
            face_center(forcePtA, forcePtB, forcePtC).z + 0.4), face_center(forcePtA, forcePtB, forcePtC), applyForceArrowMaterial, 0.015, 0.04, 0.55);
    force_general.add(applyArrow);
    const applyArrowOut = createCylinderArrowMesh(new THREE.Vector3(
        face_center(forcePtA, forcePtB, forcePtC).x,
        face_center(forcePtA, forcePtB, forcePtC).y,
        face_center(forcePtA, forcePtB, forcePtC).z + 0.4), face_center(forcePtA, forcePtB, forcePtC), applyForceArrowMaterialOut, 0.02, 0.045, 0.545);
    force_general.add(applyArrowOut);

    force_general.add(createSpriteTextApply('n', "f", new THREE.Vector3(
        face_center(forcePtA, forcePtB, forcePtC).x,
        face_center(forcePtA, forcePtB, forcePtC).y,
        face_center(forcePtA, forcePtB, forcePtC).z + 0.4)))

    const applyArrow2 = createCylinderArrowMesh(
        new THREE.Vector3(
            face_center(forcePtA, forcePtC, forcePtD).x,
            face_center(forcePtA, forcePtC, forcePtD).y,
            face_center(forcePtA, forcePtC, forcePtD).z + 0.4), face_center(forcePtA, forcePtD, forcePtC), applyForceArrowMaterial, 0.015, 0.04, 0.55);
    force_general.add(applyArrow2);
    const applyArrowOut2 = createCylinderArrowMesh(new THREE.Vector3(
        face_center(forcePtA, forcePtC, forcePtD).x,
        face_center(forcePtA, forcePtC, forcePtD).y,
        face_center(forcePtA, forcePtC, forcePtD).z + 0.4), face_center(forcePtA, forcePtD, forcePtC), applyForceArrowMaterialOut, 0.02, 0.045, 0.545);
    force_general.add(applyArrowOut2);

    // *********************** force trial point O **************************

    var TrialP_O = new THREE.Vector3(fo.x, fo.y, fo.z);

    // ***********************           trial form                **************************
    var trial_P1 = new THREE.Vector3(formBtPt1.x, formBtPt1.y, triP1.z)

    var trial_o1 = create_trial_intec(trial_P1, forcePtA, TrialP_O, forcePtB, formPtO1, formPtO1b);
    var trial_P2 = create_trial_intec(trial_o1, forcePtB, TrialP_O, forcePtC, formBtPt2, new THREE.Vector3(formBtPt2.x, formBtPt2.y, formBtPt2.z - 1));
    var trial_o2 = create_trial_intec(trial_o1, forcePtA, TrialP_O, forcePtC, formPtO2, formPtO2b);
    var trial_P3 = create_trial_intec(trial_o2, forcePtC, TrialP_O, forcePtD, formBtPt3, new THREE.Vector3(formBtPt3.x, formBtPt3.y, formBtPt3.z - 1));
    var trial_P4 = create_trial_intec(trial_o2, forcePtA, TrialP_O, forcePtD, formBtPt4, new THREE.Vector3(formBtPt4.x, formBtPt4.y, formBtPt4.z - 1));

    //trial form closing plane
    //plane mesh

    //trial plane face normals
    var force_normal_material = new THREE.MeshPhongMaterial({color: "red"})

    // ***********************          find trial force point x1 and x2              **************************

    //location of x1 x2
    //find x1
    var ForceX1_vec = CalNormalVectorUpdated(trial_P1, trial_P2, trial_P4, 0.5);
    var ForceX1_temp = new THREE.Vector3(TrialP_O.x - 1.2 * ForceX1_vec.x, TrialP_O.y - 1.2 * ForceX1_vec.y, TrialP_O.z - 1.2 * ForceX1_vec.z);

    //define intersection point x1
    var intersect_x1_vec = new THREE.Vector3(ForceX1_temp.x - TrialP_O.x, ForceX1_temp.y - TrialP_O.y, ForceX1_temp.z - TrialP_O.z);
    var applyplanevec = CalNormalVectorUpdated(forcePtA, forcePtB, forcePtC, 0.5);
    var ForceX1 = Cal_Plane_Line_Intersect_Point(TrialP_O, intersect_x1_vec, forcePtB, applyplanevec);

    var line_ox1 = [];
    line_ox1.push(TrialP_O);
    line_ox1.push(ForceX1);
    var line_ox1_geo = new THREE.BufferGeometry().setFromPoints(line_ox1);
    var applyline_1 = new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.2,
        gapSize: 0.03,
        linewidth: 1
    });
    var applylineox1 = new THREE.LineSegments(line_ox1_geo, applyline_1);
    applylineox1.computeLineDistances();//compute

    //find x2

    var ForceX2_vec = CalNormalVectorUpdated(trial_P2, trial_P4, trial_P3, 0.5);
    var ForceX2_temp = new THREE.Vector3(TrialP_O.x - 1.2 * ForceX2_vec.x, TrialP_O.y - 1.2 * ForceX2_vec.y, TrialP_O.z - 1.2 * ForceX2_vec.z);

    var intersect_x2_vec = new THREE.Vector3(ForceX2_temp.x - TrialP_O.x, ForceX2_temp.y - TrialP_O.y, ForceX2_temp.z - TrialP_O.z);
    var ForceX2 = Cal_Plane_Line_Intersect_Point(TrialP_O, intersect_x2_vec, forcePtB, applyplanevec);

    var line_ox2 = [];
    line_ox2.push(TrialP_O);
    line_ox2.push(ForceX2);

    var line_ox2_geo = new THREE.BufferGeometry().setFromPoints(line_ox2);
    var applylineox2 = new THREE.LineSegments(line_ox2_geo, applyline_1);
    applylineox2.computeLineDistances();//compute

    //add x1 x2 arrow

    //add x1 x2 sphere
    var materialpointx = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});

    var spforcePointx = new THREE.SphereGeometry(0.01);
    var new_forcePointx1 = new THREE.Mesh(spforcePointx, materialpointx);

    new_forcePointx1.position.copy(ForceX1);

    var outlineMaterialx = new THREE.MeshBasicMaterial({color: "red", transparent: false, side: THREE.BackSide});
    var outlineMeshnewx1 = new THREE.Mesh(spforcePointx, outlineMaterialx);
    outlineMeshnewx1.position.copy(ForceX1);
    outlineMeshnewx1.scale.multiplyScalar(1.55);

    var new_forcePointx2 = new THREE.Mesh(spforcePointx, materialpointx);

    new_forcePointx2.position.copy(ForceX2);

    var outlineMaterialx = new THREE.MeshBasicMaterial({color: "red", transparent: false, side: THREE.BackSide});
    var outlineMeshnewx2 = new THREE.Mesh(spforcePointx, outlineMaterialx);
    outlineMeshnewx2.position.copy(ForceX2);
    outlineMeshnewx2.scale.multiplyScalar(1.55);

    //draw x1o1, x2o2
    //find constrain point o1

    var ForceO1_temp = CalNormalVectorUpdated(formBtPt1, formBtPt2, formBtPt4, 0.5);
    var ForceO1 = new THREE.Vector3(ForceX1.x - o1.l * ForceO1_temp.x, ForceX1.y - o1.l * ForceO1_temp.y, ForceX1.z - o1.l * ForceO1_temp.z);

    var line_o1x1_temp = [];
    line_o1x1_temp.push(ForceX1);
    line_o1x1_temp.push(ForceO1);

    var line_o1x1_geo = new THREE.BufferGeometry().setFromPoints(line_o1x1_temp);
    var line_o1x1 = new THREE.LineSegments(line_o1x1_geo, applyline_1);
    line_o1x1.computeLineDistances();//compute
    force_general.add(line_o1x1);

    //add o1 arrow
    var ForceO1_closeP1 = addVectorAlongDir(ForceO1, ForceX1, -0.6);
    var ForceO1_closeP2 = addVectorAlongDir(ForceO1, ForceX1, -0.4);
    var ForceO1_arrow = createCylinderArrowMesh(ForceO1_closeP1, ForceO1_closeP2, force_normal_material, 0.012, 0.025, 0.55);

    force_general.add(ForceO1_arrow);

    //find constrain point o2

    var ForceO2_temp = CalNormalVectorUpdated(formBtPt2, formBtPt3, formBtPt4, 0.5);
    var ForceO2 = new THREE.Vector3(ForceX2.x - o2.l * ForceO2_temp.x, ForceX2.y - o2.l * ForceO2_temp.y, ForceX2.z - o2.l * ForceO2_temp.z);

    var line_o2x2_temp = [];
    line_o2x2_temp.push(ForceX2);
    line_o2x2_temp.push(ForceO2);

    var line_o2x2_geo = new THREE.BufferGeometry().setFromPoints(line_o2x2_temp);

    var line_o2x2 = new THREE.LineSegments(line_o2x2_geo, applyline_1);
    line_o2x2.computeLineDistances();//compute
    force_general.add(line_o2x2);

    //add o2 arrow

    var ForceO2_closeP1 = addVectorAlongDir(ForceO2, ForceX2, -0.6);
    var ForceO2_closeP2 = addVectorAlongDir(ForceO2, ForceX2, -0.4);

    var ForceO2_arrow = createCylinderArrowMesh(ForceO2_closeP1, ForceO2_closeP2, force_normal_material, 0.012, 0.025, 0.55);

    force_general.add(ForceO2_arrow);

    // ***********************          find force edges        **************************

    const forceEdgeAO1 = createCylinderMesh(forcePtA, ForceO1, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeAO1);

    const forceEdgeAO2 = createCylinderMesh(forcePtA, ForceO2, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeAO2);

    const forceEdgeO1O2 = createCylinderMesh(ForceO1, ForceO2, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeO1O2);

    const forceEdgeBO1 = createCylinderMesh(forcePtB, ForceO1, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeBO1);

    const forceEdgeCO1 = createCylinderMesh(forcePtC, ForceO1, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeCO1);

    const forceEdgeCO2 = createCylinderMesh(forcePtC, ForceO2, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeCO2);

    const forceEdgeDO2 = createCylinderMesh(forcePtD, ForceO2, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeDO2);


    // ***********************          find form edges        **************************

    //New Point o1
    var formPt1 = CalNormalVectorUpdated(forcePtA, ForceO1, forcePtB, 0.5);
    var formPt1end = new THREE.Vector3(formBtPt1.x - 1.2 * formPt1.x, formBtPt1.y - 1.2 * formPt1.y, formBtPt1.z - 1.2 * formPt1.z);
    var formPt2 = CalNormalVectorUpdated(forcePtC, ForceO1, forcePtB, 0.5);
    var formPt2end = new THREE.Vector3(formBtPt2.x - 1.2 * formPt2.x, formBtPt2.y - 1.2 * formPt2.y, formBtPt2.z - 1.2 * formPt2.z);

    var diro1 = new THREE.Vector3(); // create once an reuse it
    diro1.subVectors(formBtPt1, formPt1end).normalize();
    var diro12 = new THREE.Vector3(); // create once an reuse it
    diro12.subVectors(formBtPt2, formPt2end).normalize();
    var formPtO1new = LinesSectPt(diro1, formBtPt1, diro12, formBtPt2);
    var materialpointo = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
    var spformPointO1 = new THREE.SphereGeometry(0.04);
    var new_formPtO1 = new THREE.Mesh(spformPointO1, materialpointo);
    new_formPtO1.position.copy(formPtO1new);
    new_formPtO1.castShadow = true;
    var outlineMaterial1 = new THREE.MeshBasicMaterial({color: "black", transparent: false, side: THREE.BackSide});
    var outlineMeshnew1 = new THREE.Mesh(spformPointO1, outlineMaterial1);
    outlineMeshnew1.position.copy(formPtO1new);
    outlineMeshnew1.scale.multiplyScalar(1.55);

    form_group_v.add(new_formPtO1);
    form_group_v.add(outlineMeshnew1);

    //New Point o2
    var formPt3 = CalNormalVectorUpdated(forcePtD, forcePtC, ForceO2, 0.5);
    var formPt3end = new THREE.Vector3(formBtPt3.x - 1.2 * formPt3.x, formBtPt3.y - 1.2 * formPt3.y, formBtPt3.z - 1.2 * formPt3.z);
    var formPt4 = CalNormalVectorUpdated(forcePtA, forcePtD, ForceO2, 0.5);
    var formPt4end = new THREE.Vector3(formBtPt4.x - 1.2 * formPt4.x, formBtPt4.y - 1.2 * formPt4.y, formBtPt4.z - 1.2 * formPt4.z);

    var diro2 = new THREE.Vector3(); // create once an reuse it
    diro2.subVectors(formBtPt3, formPt3end).normalize();
    var diro22 = new THREE.Vector3(); // create once an reuse it
    diro22.subVectors(formBtPt4, formPt4end).normalize();
    var formPtO2new = LinesSectPt(diro2, formBtPt3, diro22, formBtPt4);
    var materialpointo = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
    var spformPointO2 = new THREE.SphereGeometry(0.04);
    var new_formPtO2 = new THREE.Mesh(spformPointO2, materialpointo);
    new_formPtO2.position.copy(formPtO2new);
    new_formPtO2.castShadow = true;
    var outlineMaterial2 = new THREE.MeshBasicMaterial({color: "black", transparent: false, side: THREE.BackSide});
    var outlineMeshnew2 = new THREE.Mesh(spformPointO2, outlineMaterial2);
    outlineMeshnew2.position.copy(formPtO2new);
    outlineMeshnew2.scale.multiplyScalar(1.55);

    form_group_v.add(new_formPtO2);
    form_group_v.add(outlineMeshnew2);

    //New Point o3
    var formPtO3a = CalNormalVectorUpdated(forcePtC, forcePtA, ForceO1, 0.5);
    var formPtO3aend = new THREE.Vector3(formPtO1new.x - 1.2 * formPtO3a.x, formPtO1new.y - 1.2 * formPtO3a.y, formPtO1new.z - 1.2 * formPtO3a.z);
    var formPtO3b = CalNormalVectorUpdated(forcePtA, forcePtC, ForceO2, 0.5);
    var formPtO3bend = new THREE.Vector3(formPtO2new.x - 1.2 * formPtO3b.x, formPtO2new.y - 1.2 * formPtO3b.y, formPtO2new.z - 1.2 * formPtO3b.z);

    var diro3 = new THREE.Vector3(); // create once an reuse it
    diro3.subVectors(formPtO1new, formPtO3aend).normalize();
    var diro32 = new THREE.Vector3(); // create once an reuse it
    diro32.subVectors(formPtO2new, formPtO3bend).normalize();
    var formPtO3new = LinesSectPt(diro3, formPtO1new, diro32, formPtO2new);
    var materialpointo = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
    var spformPointO3 = new THREE.SphereGeometry(0.04);
    var new_formPtO3 = new THREE.Mesh(spformPointO3, materialpointo);
    new_formPtO3.position.copy(formPtO3new);
    new_formPtO3.castShadow = true;
    var outlineMaterial3 = new THREE.MeshBasicMaterial({color: "black", transparent: false, side: THREE.BackSide});
    var outlineMeshnew3 = new THREE.Mesh(spformPointO3, outlineMaterial3);
    outlineMeshnew3.position.copy(formPtO3new);
    outlineMeshnew3.scale.multiplyScalar(1.55);

    form_group_v.add(new_formPtO3);
    form_group_v.add(outlineMeshnew3);

    //Cal areas
    var areaACO2 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtA, ForceO2),
        new THREE.Vector3().subVectors(forcePtC, ForceO2),
    ).length() / 2

    var areaCO1O2 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(ForceO1, forcePtC),
        new THREE.Vector3().subVectors(ForceO2, forcePtC),
    ).length() / 2

    var areaAO1O2 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(ForceO1, forcePtA),
        new THREE.Vector3().subVectors(ForceO2, forcePtA),
    ).length() / 2

    var areaACO1 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtC, ForceO1),
        new THREE.Vector3().subVectors(forcePtA, ForceO1),
    ).length() / 2

    var areaABO1 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtB, ForceO1),
        new THREE.Vector3().subVectors(forcePtA, ForceO1),
    ).length() / 2

    var areaBCO1 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtB, ForceO1),
        new THREE.Vector3().subVectors(forcePtC, ForceO1),
    ).length() / 2

    var areaCDO2 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtC, ForceO2),
        new THREE.Vector3().subVectors(forcePtD, ForceO2),
    ).length() / 2

    var areaADO2 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtA, ForceO2),
        new THREE.Vector3().subVectors(forcePtD, ForceO2),
    ).length() / 2

    var areaMax = Math.max(areaACO2, areaCO1O2, areaAO1O2, areaACO1, areaABO1, areaBCO1, areaCDO2, areaADO2)

    // *********************** calculating the normals for each triangle ***********************

    //red color options:
    //0.75 - 0x80002F
    //0.5 - 0.75 - 0x940041
    //0.25 - 0.5 - 0xCC0549
    //0 - 0.25 - 0xD72F62

    //blue color options:
    //0.75 - 0x0F3150
    //0.5 - 0.75 - 0x05416D
    //0.25 - 0.5 - 0x376D9B
    //0 - 0.25 - 0x5B84AE

    var formedgeColor1, formedgeColor2, formedgeColor3, formedgeColor4, formedgeColor5, formedgeColor6,
        formedgeColor7, formedgeColor8;

    var forceFaceABC = ForceFace3ptGreen(forcePtA, forcePtB, forcePtC, 0x014F06)
    force_group_f.add(forceFaceABC)

    var radiusABC = 0.05 * (new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtA, forcePtB,),
        new THREE.Vector3().subVectors(forcePtC, forcePtB,),
    ).length() / 2)
    radiusABC = THREE.MathUtils.clamp(radiusABC, 0.05, 0.15);

    var ABCarrow = createCircleFaceArrow(face_center(forcePtA, forcePtB, forcePtC), radiusABC, cross(subVecUpdated(forcePtA, forcePtB), subVecUpdated(forcePtB, forcePtC)))
    force_general.add(ABCarrow);

    var forceFaceACD = ForceFace3ptGreen(forcePtA, forcePtC, forcePtD, 0x014F06)
    force_group_f.add(forceFaceACD)


    var radiusACD = 0.05 * (new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtA, forcePtD,),
        new THREE.Vector3().subVectors(forcePtC, forcePtD,),
    ).length() / 2)
    radiusACD = THREE.MathUtils.clamp(radiusACD, 0.05, 0.15);

    var ACDarrow = createCircleFaceArrow(face_center(forcePtA, forcePtD, forcePtC), radiusACD, cross(subVecUpdated(forcePtA, forcePtC), subVecUpdated(forcePtC, forcePtD)))
    force_general.add(ACDarrow);

    var forcePtA_text = createSpriteText('A', "", new THREE.Vector3(forcePtA.x, forcePtA.y, forcePtA.z + 0.05))
    force_general.add(forcePtA_text)
    var forcePtB_text = createSpriteText('B', "", new THREE.Vector3(forcePtB.x, forcePtB.y, forcePtB.z + 0.05))
    force_general.add(forcePtB_text)
    var forcePtC_text = createSpriteText('C', "", new THREE.Vector3(forcePtC.x, forcePtC.y, forcePtC.z + 0.05))
    force_general.add(forcePtC_text)
    var forcePtD_text = createSpriteText('D', "", new THREE.Vector3(forcePtD.x, forcePtD.y, forcePtD.z + 0.05))
    force_general.add(forcePtD_text)

    var forcePtO1_text = createSpriteText('O', "1", new THREE.Vector3(ForceO1.x, ForceO1.y, ForceO1.z - 0.25))
    force_general.add(forcePtO1_text)
    var forcePtO2_text = createSpriteText('O', "2", new THREE.Vector3(ForceO2.x, ForceO2.y, ForceO2.z - 0.25))
    force_general.add(forcePtO2_text)

    // triangle ABO1 - 1
    var normalABO1_a = subVec(forcePtB, forcePtA)
    var normalABO1_b = subVec(forcePtA, ForceO1)
    var normalABO1 = cross(normalABO1_a, normalABO1_b)
    var edgePt1O1 = subVec(formBtPt1, formPtO1new);
    var resultPt1O1 = normalABO1.dot(edgePt1O1);

    var forceNormalMaterialOutline = new THREE.MeshPhongMaterial({
        color: "white", transparent: false, side: THREE.BackSide
    });

    if (resultPt1O1 < 0) {
        if (areaABO1 / areaMax >= 0.75) {
            formedgeColor1 = 0x0F3150
        }
        if (0.5 <= areaABO1 / areaMax && areaABO1 / areaMax < 0.75) {
            formedgeColor1 = 0x05416D
        }
        if (0.25 <= areaABO1 / areaMax && areaABO1 / areaMax < 0.5) {
            formedgeColor1 = 0x376D9B
        }
        if (0 <= areaABO1 / areaMax && areaABO1 / areaMax < 0.25) {
            formedgeColor1 = 0x5B84AE
        }
        var forceFaceABO1 = ForceFace3pt(forcePtA, forcePtB, ForceO1, formedgeColor1);
    } else {
        if (areaABO1 / areaMax >= 0.75) {
            formedgeColor1 = 0x80002F
        }
        if (0.5 <= areaABO1 / areaMax && areaABO1 / areaMax < 0.75) {
            formedgeColor1 = 0x940041
        }
        if (0.25 <= areaABO1 / areaMax && areaABO1 / areaMax < 0.5) {
            formedgeColor1 = 0xCC0549
        }
        if (0 <= areaABO1 / areaMax && areaABO1 / areaMax < 0.25) {
            formedgeColor1 = 0xD72F62
        }
        var forceFaceABO1 = ForceFace3pt(forcePtA, forcePtB, ForceO1, formedgeColor1);
    }
    var formEdgePt1O1Material = new THREE.MeshPhongMaterial({
        color: formedgeColor1
    });
    var forceEdgePt1O1Material = new THREE.MeshPhongMaterial({
        color: formedgeColor1
    });

    force_group_f.add(forceFaceABO1)
    force_general.add(ForceFaceNormalsArrow(forcePtA, forcePtB, ForceO1, 0.4, forceEdgePt1O1Material, forceNormalMaterialOutline, "1", false))

    var radiusABO1 = 0.1 * (new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtA, ForceO1),
        new THREE.Vector3().subVectors(forcePtB, ForceO1),
    ).length() / 2)
    radiusABO1 = THREE.MathUtils.clamp(radiusABO1, 0.05, 0.15);

    var ABO1arrow = createCircleFaceArrow(face_center(forcePtA, forcePtB, ForceO1), radiusABO1,
        cross(subVecUpdated(forcePtB, forcePtA), subVecUpdated(forcePtA, ForceO1)))
    force_general.add(ABO1arrow);


    var edgeSize1 = areaABO1 * 0.02;
    edgeSize1 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);

    //create end sphere for bottom vertice 1
    const endPtVertice1SpV = addVectorAlongDir(formBtPt1, formPtO1new, -0.14);
    const endPtVertice1Sp = addEdgeSphere(edgeSize1, endPtVertice1SpV, formedgeColor1)
    //create edge bottom vertice 1
    const endPtVertice1 = addVectorAlongDir(formPtO1new, formBtPt1, -0.1);
    const formEdge1 = createCylinderMesh(endPtVertice1SpV, endPtVertice1, formEdgePt1O1Material, edgeSize1, edgeSize1);

    form_group_e.add(endPtVertice1Sp)
    form_group_e.add(formEdge1)

    // triangle BCO1 -2
    var normalBCO1_a = subVec(forcePtC, forcePtB)
    var normalBCO1_b = subVec(forcePtB, ForceO1)
    var normalBCO1 = cross(normalBCO1_a, normalBCO1_b)
    var edgePt2O1 = subVec(formBtPt2, formPtO1new);
    var resultPt2O1 = normalBCO1.dot(edgePt2O1)

    if (resultPt2O1 < 0) {
        if (areaBCO1 / areaMax >= 0.75) {
            formedgeColor2 = 0x0F3150
        }
        if (0.5 <= areaBCO1 / areaMax && areaBCO1 / areaMax < 0.75) {
            formedgeColor2 = 0x05416D
        }
        if (0.25 <= areaBCO1 / areaMax && areaBCO1 / areaMax < 0.5) {
            formedgeColor2 = 0x376D9B
        }
        if (0 <= areaBCO1 / areaMax && areaBCO1 / areaMax < 0.25) {
            formedgeColor2 = 0x5B84AE
        }
        var forceFaceBCO1 = ForceFace3pt(forcePtB, forcePtC, ForceO1, formedgeColor2);
    } else {
        if (areaBCO1 / areaMax >= 0.75) {
            formedgeColor2 = 0x80002F
        }
        if (0.5 <= areaBCO1 / areaMax && areaBCO1 / areaMax < 0.75) {
            formedgeColor2 = 0x940041
        }
        if (0.25 <= areaBCO1 / areaMax && areaBCO1 / areaMax < 0.5) {
            formedgeColor2 = 0xCC0549
        }
        if (0 <= areaBCO1 / areaMax && areaBCO1 / areaMax < 0.25) {
            formedgeColor2 = 0xD72F62
        }
        var forceFaceBCO1 = ForceFace3pt(forcePtB, forcePtC, ForceO1, formedgeColor2);
    }
    var formEdgePt2O1Material = new THREE.MeshPhongMaterial({
        color: formedgeColor2
    });

    var forceEdgePt2O1Material = new THREE.MeshPhongMaterial({
        color: formedgeColor2
    });

    force_group_f.add(forceFaceBCO1)
    force_general.add(ForceFaceNormalsArrow(forcePtB, forcePtC, ForceO1, 0.4, forceEdgePt2O1Material, forceNormalMaterialOutline, "2", false))

    var radiusBCO1 = 0.1 * (new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtC, ForceO1),
        new THREE.Vector3().subVectors(forcePtB, ForceO1),
    ).length() / 2)
    radiusBCO1 = THREE.MathUtils.clamp(radiusBCO1, 0.05, 0.15);

    var BCO1arrow = createCircleFaceArrow(face_center(forcePtC, forcePtB, ForceO1), radiusBCO1,
        cross(subVecUpdated(forcePtC, forcePtB), subVecUpdated(forcePtB, ForceO1)))
    force_general.add(BCO1arrow);

    var edgeSize2 = areaBCO1 * 0.02;
    edgeSize2 = THREE.MathUtils.clamp(edgeSize2, 0.01, 0.5);

    //create end sphere for bottom vertice 1
    const endPtVertice2SpV = addVectorAlongDir(formBtPt2, formPtO1new, -0.14);
    const endPtVertice2Sp = addEdgeSphere(edgeSize2, endPtVertice2SpV, formedgeColor2)
    //create edge bottom vertice 1
    const endPtVertice2 = addVectorAlongDir(formPtO1new, formBtPt2, -0.1);
    const formEdge2 = createCylinderMesh(endPtVertice2SpV, endPtVertice2, formEdgePt2O1Material, edgeSize2, edgeSize2);

    form_group_e.add(endPtVertice2Sp)
    form_group_e.add(formEdge2)

    // triangle CO1O2 - 3
    var normalCO1O2_a = subVec(forcePtC, ForceO1);
    var normalCO1O2_b = subVec(ForceO1, ForceO2);
    var normalCO1O2 = cross(normalCO1O2_a, normalCO1O2_b);
    var edgePt2O3 = subVec(formBtPt2, formPtO3new);
    var resultPt2O3 = normalCO1O2.dot(edgePt2O3);

    if (resultPt2O3 < 0) {
        if (areaCO1O2 / areaMax >= 0.75) {
            formedgeColor3 = 0x0F3150
        }
        if (0.5 <= areaCO1O2 / areaMax && areaCO1O2 / areaMax < 0.75) {
            formedgeColor3 = 0x05416D
        }
        if (0.25 <= areaCO1O2 / areaMax && areaCO1O2 / areaMax < 0.5) {
            formedgeColor3 = 0x376D9B
        }
        if (0 <= areaCO1O2 / areaMax && areaCO1O2 / areaMax < 0.25) {
            formedgeColor3 = 0x5B84AE
        }
        var forceFaceCO1O2 = ForceFace3pt(forcePtC, ForceO2, ForceO1, formedgeColor3);
    } else {
        if (areaCO1O2 / areaMax >= 0.75) {
            formedgeColor3 = 0x80002F
        }
        if (0.5 <= areaCO1O2 / areaMax && areaCO1O2 / areaMax < 0.75) {
            formedgeColor3 = 0x940041
        }
        if (0.25 <= areaCO1O2 / areaMax && areaCO1O2 / areaMax < 0.5) {
            formedgeColor3 = 0xCC0549
        }
        if (0 <= areaCO1O2 / areaMax && areaCO1O2 / areaMax < 0.25) {
            formedgeColor3 = 0xD72F62
        }
        var forceFaceCO1O2 = ForceFace3pt(forcePtC, ForceO2, ForceO1, formedgeColor3);
    }

    var formEdgePt2O3Material = new THREE.MeshPhongMaterial({
        color: formedgeColor3
    });
    var forceEdgePt2O3Material = new THREE.MeshPhongMaterial({
        color: formedgeColor3
    });
    force_group_f.add(forceFaceCO1O2)
    if (resultPt2O3 > 0) {
        force_general.add(ForceFaceNormalsArrow(forcePtC, ForceO2, ForceO1, 0.4, forceEdgePt2O3Material, forceNormalMaterialOutline, "", true))
    } else {
        force_general.add(ForceFaceNormalsArrow(forcePtC, ForceO2, ForceO1, 0.4, forceEdgePt2O3Material, forceNormalMaterialOutline, "", false))
    }

    var radiusCO1O2 = 0.1 * (new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtC, ForceO1),
        new THREE.Vector3().subVectors(ForceO2, ForceO1),
    ).length() / 2)
    radiusCO1O2 = THREE.MathUtils.clamp(radiusCO1O2, 0.05, 0.15);

    var CO1O2arrow = createCircleFaceArrow(face_center(forcePtC, ForceO2, ForceO1), radiusCO1O2,
        cross(subVecUpdated(forcePtC, ForceO1), subVecUpdated(ForceO1, ForceO2)))
    force_general.add(CO1O2arrow);


    var edgeSize3 = areaCO1O2 * 0.02;
    edgeSize3 = THREE.MathUtils.clamp(edgeSize3, 0.01, 0.5);

    //create end sphere for bottom vertice 1
    const endPtVertice3SpV = addVectorAlongDir(formBtPt2, formPtO3new, -0.14);
    const endPtVertice3Sp = addEdgeSphere(edgeSize3, endPtVertice3SpV, formedgeColor3)
    //create edge bottom vertice 1
    const endPtVertice3 = addVectorAlongDir(formPtO3new, formBtPt2, -0.1);
    const formEdge3 = createCylinderMesh(endPtVertice3SpV, endPtVertice3, formEdgePt2O3Material, edgeSize3, edgeSize3);

    form_group_e.add(endPtVertice3Sp)
    form_group_e.add(formEdge3)

    // triangle ACO1 - 4
    var normalACO1_a = subVec(forcePtC, forcePtA);
    var normalACO1_b = subVec(forcePtA, ForceO1);
    var normalACO1 = cross(normalACO1_a, normalACO1_b);
    var edgePtO1O3 = subVec(formPtO1new, formPtO3new);
    var resultPtO1O3 = normalACO1.dot(edgePtO1O3);

    if (resultPtO1O3 < 0) {
        if (areaACO1 / areaMax >= 0.75) {
            formedgeColor4 = 0x0F3150
        }
        if (0.5 <= areaACO1 / areaMax && areaACO1 / areaMax < 0.75) {
            formedgeColor4 = 0x05416D
        }
        if (0.25 <= areaACO1 / areaMax && areaACO1 / areaMax < 0.5) {
            formedgeColor4 = 0x376D9B
        }
        if (0 <= areaACO1 / areaMax && areaACO1 / areaMax < 0.25) {
            formedgeColor4 = 0x5B84AE
        }
        var forceFaceACO1 = ForceFace3pt(forcePtC, forcePtA, ForceO1, formedgeColor4);
    } else {
        if (areaACO1 / areaMax >= 0.75) {
            formedgeColor4 = 0x80002F
        }
        if (0.5 <= areaACO1 / areaMax && areaACO1 / areaMax < 0.75) {
            formedgeColor4 = 0x940041
        }
        if (0.25 <= areaACO1 / areaMax && areaACO1 / areaMax < 0.5) {
            formedgeColor4 = 0xCC0549
        }
        if (0 <= areaACO1 / areaMax && areaACO1 / areaMax < 0.25) {
            formedgeColor4 = 0xD72F62
        }
        var forceFaceACO1 = ForceFace3pt(forcePtC, forcePtA, ForceO1, formedgeColor4);
    }

    var formEdgePtO1O3Material = new THREE.MeshPhongMaterial({
        color: formedgeColor4
    });

    force_group_f.add(forceFaceACO1)

    var edgeSize4 = areaACO1 * 0.02;
    edgeSize4 = THREE.MathUtils.clamp(edgeSize4, 0.01, 0.5);

    //create end sphere for bottom vertice 1
    const endPtVertice4SpV = addVectorAlongDir(formPtO1new, formPtO3new, -0.14);
    const endPtVertice4SpV2 = addVectorAlongDir(formPtO3new, formPtO1new, -0.14);
    const endPtVertice4Sp = addEdgeSphere(edgeSize4, endPtVertice4SpV, formedgeColor4)
    const endPtVertice4Sp2 = addEdgeSphere(edgeSize4, endPtVertice4SpV2, formedgeColor4)
    //create edge bottom vertice 1
    const endPtVertice4 = addVectorAlongDir(formPtO3new, formPtO1new, -0.14);
    const formEdge4 = createCylinderMesh(endPtVertice4SpV, endPtVertice4, formEdgePtO1O3Material, edgeSize4, edgeSize4);

    form_group_e.add(endPtVertice4Sp)
    form_group_e.add(endPtVertice4Sp2)
    form_group_e.add(formEdge4)


    // triangle AO1O2 - 5
    var normalAO1O2_a = subVec(forcePtA, ForceO2);
    var normalAO1O2_b = subVec(ForceO2, ForceO1);
    var normalAO1O2 = cross(normalAO1O2_a, normalAO1O2_b);
    var edgePt4O3 = subVec(formBtPt4, formPtO3new);
    var resultPt4O3 = normalAO1O2.dot(edgePt4O3);

    if (resultPt4O3 < 0) {
        if (areaAO1O2 / areaMax >= 0.75) {
            formedgeColor5 = 0x0F3150
        }
        if (0.5 <= areaAO1O2 / areaMax && areaAO1O2 / areaMax < 0.75) {
            formedgeColor5 = 0x05416D
        }
        if (0.25 <= areaAO1O2 / areaMax && areaAO1O2 / areaMax < 0.5) {
            formedgeColor5 = 0x376D9B
        }
        if (0 <= areaAO1O2 / areaMax && areaAO1O2 / areaMax < 0.25) {
            formedgeColor5 = 0x5B84AE
        }
        var forceFaceAO1O2 = ForceFace3pt(forcePtA, ForceO1, ForceO2, formedgeColor5);
    } else {
        if (areaAO1O2 / areaMax >= 0.75) {
            formedgeColor5 = 0x80002F
        }
        if (0.5 <= areaAO1O2 / areaMax && areaAO1O2 / areaMax < 0.75) {
            formedgeColor5 = 0x940041
        }
        if (0.25 <= areaAO1O2 / areaMax && areaAO1O2 / areaMax < 0.5) {
            formedgeColor5 = 0xCC0549
        }
        if (0 <= areaAO1O2 / areaMax && areaAO1O2 / areaMax < 0.25) {
            formedgeColor5 = 0xD72F62
        }
        var forceFaceAO1O2 = ForceFace3pt(forcePtA, ForceO1, ForceO2, formedgeColor5);
    }

    var formEdgePt4O3Material = new THREE.MeshPhongMaterial({
        color: formedgeColor5
    });
    var forceEdgePt4O3Material = new THREE.MeshPhongMaterial({
        color: formedgeColor5
    });
    force_group_f.add(forceFaceAO1O2)
    if (resultPt4O3 > 0) {
        force_general.add(ForceFaceNormalsArrow(forcePtA, ForceO1, ForceO2, 0.4, forceEdgePt4O3Material, forceNormalMaterialOutline, "", true))
    } else {
        force_general.add(ForceFaceNormalsArrow(forcePtA, ForceO1, ForceO2, 0.4, forceEdgePt4O3Material, forceNormalMaterialOutline, "", false))
    }

    var radiusAO1O2 = 0.1 * (new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtA, ForceO1),
        new THREE.Vector3().subVectors(ForceO2, ForceO1),
    ).length() / 2)
    radiusAO1O2 = THREE.MathUtils.clamp(radiusAO1O2, 0.07, 0.15);

    var AO1O2arrow = createCircleFaceArrow(face_center(forcePtA, ForceO2, ForceO1), radiusAO1O2,
        cross(subVecUpdated(forcePtA, ForceO2), subVecUpdated(ForceO2, ForceO1)))
    force_general.add(AO1O2arrow);


    var edgeSize5 = areaAO1O2 * 0.02;
    edgeSize5 = THREE.MathUtils.clamp(edgeSize5, 0.01, 0.5);

    //create end sphere for bottom vertice 1
    const endPtVertice5SpV = addVectorAlongDir(formBtPt4, formPtO3new, -0.14);
    const endPtVertice5Sp = addEdgeSphere(edgeSize5, endPtVertice5SpV, formedgeColor5)
    //create edge bottom vertice 1
    const endPtVertice5 = addVectorAlongDir(formPtO3new, formBtPt4, -0.1);
    const formEdge5 = createCylinderMesh(endPtVertice5SpV, endPtVertice5, formEdgePt4O3Material, edgeSize5, edgeSize5);

    form_group_e.add(endPtVertice5Sp)
    form_group_e.add(formEdge5)

    // triangle ACO2 - 6
    var normalACO2_a = subVec(forcePtA, forcePtC);
    var normalACO2_b = subVec(forcePtC, ForceO2);
    var normalACO2 = cross(normalACO2_a, normalACO2_b);
    var edgePtO2O3 = subVec(formPtO2new, formPtO3new);
    var resultPtO2O3 = normalACO2.dot(edgePtO2O3);

    if (resultPtO2O3 < 0) {
        if (areaACO2 / areaMax >= 0.75) {
            formedgeColor6 = 0x0F3150
        }
        if (0.5 <= areaACO2 / areaMax && areaACO2 / areaMax < 0.75) {
            formedgeColor6 = 0x05416D
        }
        if (0.25 <= areaACO2 / areaMax && areaACO2 / areaMax < 0.5) {
            formedgeColor6 = 0x376D9B
        }
        if (0 <= areaACO2 / areaMax && areaACO2 / areaMax < 0.25) {
            formedgeColor6 = 0x5B84AE
        }
        var forceFaceACO2 = ForceFace3pt(forcePtA, forcePtC, ForceO2, formedgeColor6);
    } else {
        if (areaACO2 / areaMax >= 0.75) {
            formedgeColor6 = 0x80002F
        }
        if (0.5 <= areaACO2 / areaMax && areaACO2 / areaMax < 0.75) {
            formedgeColor6 = 0x940041
        }
        if (0.25 <= areaACO2 / areaMax && areaACO2 / areaMax < 0.5) {
            formedgeColor6 = 0xCC0549
        }
        if (0 <= areaACO2 / areaMax && areaACO2 / areaMax < 0.25) {
            formedgeColor6 = 0xD72F62
        }
        var forceFaceACO2 = ForceFace3pt(forcePtA, forcePtC, ForceO2, formedgeColor6);
    }

    var formEdgePtO2O3Material = new THREE.MeshPhongMaterial({
        color: formedgeColor6
    });
    force_group_f.add(forceFaceACO2)

    var edgeSize6 = areaACO2 * 0.02;
    edgeSize6 = THREE.MathUtils.clamp(edgeSize6, 0.01, 0.5);

    //create end sphere for bottom vertice 1
    const endPtVertice6SpV = addVectorAlongDir(formPtO3new, formPtO2new, -0.14);
    const endPtVertice6SpV2 = addVectorAlongDir(formPtO2new, formPtO3new, -0.14);
    const endPtVertice6Sp = addEdgeSphere(edgeSize6, endPtVertice6SpV, formedgeColor6)
    const endPtVertice6Sp2 = addEdgeSphere(edgeSize6, endPtVertice6SpV2, formedgeColor6)
    //create edge bottom vertice 1
    const endPtVertice6 = addVectorAlongDir(formPtO2new, formPtO3new, -0.14);
    const formEdge6 = createCylinderMesh(endPtVertice6SpV, endPtVertice6, formEdgePtO2O3Material, edgeSize6, edgeSize6);

    form_group_e.add(endPtVertice6Sp)
    form_group_e.add(endPtVertice6Sp2)
    form_group_e.add(formEdge6)

    // triangle ADO2 - 7
    var normalADO2_a = subVec(forcePtA, forcePtD);
    var normalADO2_b = subVec(forcePtD, ForceO2);
    var normalADO2 = cross(normalADO2_a, normalADO2_b);
    var edgePt4O2 = subVec(formBtPt4, formPtO2new);
    var resultPt4O2 = normalADO2.dot(edgePt4O2);

    if (resultPt4O2 < 0) {
        if (areaADO2 / areaMax >= 0.75) {
            formedgeColor7 = 0x0F3150
        }
        if (0.5 <= areaADO2 / areaMax && areaADO2 / areaMax < 0.75) {
            formedgeColor7 = 0x05416D
        }
        if (0.25 <= areaADO2 / areaMax && areaADO2 / areaMax < 0.5) {
            formedgeColor7 = 0x376D9B
        }
        if (0 <= areaADO2 / areaMax && areaADO2 / areaMax < 0.25) {
            formedgeColor7 = 0x5B84AE
        }
        var forceFaceADO2 = ForceFace3pt(forcePtA, ForceO2, forcePtD, formedgeColor7);
    } else {
        if (areaADO2 / areaMax >= 0.75) {
            formedgeColor7 = 0x80002F
        }
        if (0.5 <= areaADO2 / areaMax && areaADO2 / areaMax < 0.75) {
            formedgeColor7 = 0x940041
        }
        if (0.25 <= areaADO2 / areaMax && areaADO2 / areaMax < 0.5) {
            formedgeColor7 = 0xCC0549
        }
        if (0 <= areaADO2 / areaMax && areaADO2 / areaMax < 0.25) {
            formedgeColor7 = 0xD72F62
        }
        var forceFaceADO2 = ForceFace3pt(forcePtA, ForceO2, forcePtD, formedgeColor7);
    }

    var formEdgePt4O2Material = new THREE.MeshPhongMaterial({
        color: formedgeColor7
    });
    var forceEdgePt4O2Material = new THREE.MeshPhongMaterial({
        color: formedgeColor7
    });
    force_group_f.add(forceFaceADO2)
    force_general.add(ForceFaceNormalsArrow(forcePtA, ForceO2, forcePtD, 0.4, forceEdgePt4O2Material, forceNormalMaterialOutline, "4", false))

    var radiusADO2 = 0.1 * (new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtA, ForceO2),
        new THREE.Vector3().subVectors(forcePtD, ForceO2),
    ).length() / 2)
    radiusADO2 = THREE.MathUtils.clamp(radiusADO2, 0.07, 0.15);

    var ADO2arrow = createCircleFaceArrow(face_center(forcePtA, ForceO2, forcePtD), radiusADO2,
        cross(subVecUpdated(forcePtA, forcePtD), subVecUpdated(forcePtD, ForceO2)))
    force_general.add(ADO2arrow);

    var edgeSize7 = areaADO2 * 0.02;
    edgeSize7 = THREE.MathUtils.clamp(edgeSize7, 0.01, 0.5);

    //create end sphere for bottom vertice 1
    const endPtVertice7SpV = addVectorAlongDir(formBtPt4, formPtO2new, -0.14);
    const endPtVertice7Sp = addEdgeSphere(edgeSize7, endPtVertice7SpV, formedgeColor7)
    //create edge bottom vertice 1
    const endPtVertice7 = addVectorAlongDir(formPtO2new, formBtPt4, -0.1);
    const formEdge7 = createCylinderMesh(endPtVertice7SpV, endPtVertice7, formEdgePt4O2Material, edgeSize7, edgeSize7);

    form_group_e.add(endPtVertice7Sp)
    form_group_e.add(formEdge7)


    // triangle CDO2 - 8
    var normalCDO2_a = subVec(forcePtD, forcePtC);
    var normalCDO2_b = subVec(forcePtC, ForceO2);
    var normalCDO2 = cross(normalCDO2_a, normalCDO2_b);
    var edgePt3O2 = subVec(formBtPt3, formPtO2new);
    var resultPt3O2 = normalCDO2.dot(edgePt3O2);

    if (resultPt3O2 < 0) {
        if (areaCDO2 / areaMax >= 0.75) {
            formedgeColor8 = 0x0F3150
        }
        if (0.5 <= areaCDO2 / areaMax && areaCDO2 / areaMax < 0.75) {
            formedgeColor8 = 0x05416D
        }
        if (0.25 <= areaCDO2 / areaMax && areaCDO2 / areaMax < 0.5) {
            formedgeColor8 = 0x376D9B
        }
        if (0 <= areaCDO2 / areaMax && areaCDO2 / areaMax < 0.25) {
            formedgeColor8 = 0x5B84AE
        }
        var forceFaceCDO2 = ForceFace3pt(forcePtD, ForceO2, forcePtC, formedgeColor8);
    } else {
        if (areaCDO2 / areaMax >= 0.75) {
            formedgeColor8 = 0x80002F
        }
        if (0.5 <= areaCDO2 / areaMax && areaCDO2 / areaMax < 0.75) {
            formedgeColor8 = 0x940041
        }
        if (0.25 <= areaCDO2 / areaMax && areaCDO2 / areaMax < 0.5) {
            formedgeColor8 = 0xCC0549
        }
        if (0 <= areaCDO2 / areaMax && areaCDO2 / areaMax < 0.25) {
            formedgeColor8 = 0xD72F62
        }
        var forceFaceCDO2 = ForceFace3pt(forcePtD, ForceO2, forcePtC, formedgeColor8);
    }

    var formEdgePt3O2Material = new THREE.MeshPhongMaterial({
        color: formedgeColor8
    });
    var forceEdgePt3O2Material = new THREE.MeshPhongMaterial({
        color: formedgeColor8
    });
    force_group_f.add(forceFaceCDO2)
    force_general.add(ForceFaceNormalsArrow(forcePtC, forcePtD, ForceO2, 0.4, forceEdgePt3O2Material, forceNormalMaterialOutline, "3", false))

    var radiusCDO2 = 0.1 * (new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtC, ForceO2),
        new THREE.Vector3().subVectors(forcePtD, ForceO2),
    ).length() / 2)
    radiusCDO2 = THREE.MathUtils.clamp(radiusCDO2, 0.07, 0.15);

    var CDO2arrow = createCircleFaceArrow(face_center(forcePtC, forcePtD, ForceO2), radiusCDO2,
        cross(subVecUpdated(ForceO2, forcePtD), subVecUpdated(forcePtD, forcePtC)))
    force_general.add(CDO2arrow);

    var edgeSize8 = areaCDO2 * 0.02;
    edgeSize8 = THREE.MathUtils.clamp(edgeSize8, 0.01, 0.5);

    //create end sphere for bottom vertice 1
    const endPtVertice8SpV = addVectorAlongDir(formBtPt3, formPtO2new, -0.14);
    const endPtVertice8Sp = addEdgeSphere(edgeSize8, endPtVertice8SpV, formedgeColor8)
    //create edge bottom vertice 1
    const endPtVertice8 = addVectorAlongDir(formPtO2new, formBtPt3, -0.1);
    const formEdge8 = createCylinderMesh(endPtVertice8SpV, endPtVertice8, formEdgePt3O2Material, edgeSize8, edgeSize8);

    form_group_e.add(endPtVertice8Sp)
    form_group_e.add(formEdge8)

    // ********************************* force cell construction *********************************

    // cell A B C O1
    force_group_c.add(drawForceCell(forcePtA, forcePtB, forcePtC, ForceO1, forceCellScale, 0x014F06, formedgeColor1, formedgeColor2, formedgeColor4))

    // cell A O1 O2 C
    force_group_c.add(drawForceCell(forcePtA, ForceO2, ForceO1, forcePtC, forceCellScale, formedgeColor5, formedgeColor6, formedgeColor3, formedgeColor4))

    // cell A C D O2
    force_group_c.add(drawForceCell(forcePtA, forcePtC, forcePtD, ForceO2, forceCellScale, 0x014F06, formedgeColor6, formedgeColor8, formedgeColor7))

    function drawForceCell(pt1, pt2, pt3, pt4, scale, color123, color124, color234, color134) {
        //pt1 pt2 pt3 are framing the triangle; pt4 is the extrude point
        var edge = new THREE.MeshPhongMaterial({
            color: 'white'
        });
        var cellgroup = new THREE.Group();
        var forceCenterPt = new THREE.Vector3(
            (pt1.x + pt2.x + pt3.x + pt4.x) / 4,
            (pt1.y + pt2.y + pt3.y + pt4.y) / 4,
            (pt1.z + pt2.z + pt3.z + pt4.z) / 4
        )
        var pt1Offset = new THREE.Vector3(
            forceCenterPt.x - scale * (subVecUpdated(pt1, forceCenterPt).x),
            forceCenterPt.y - scale * (subVecUpdated(pt1, forceCenterPt).y),
            forceCenterPt.z - scale * (subVecUpdated(pt1, forceCenterPt).z)
        )
        var pt2Offset = new THREE.Vector3(
            forceCenterPt.x - scale * (subVecUpdated(pt2, forceCenterPt).x),
            forceCenterPt.y - scale * (subVecUpdated(pt2, forceCenterPt).y),
            forceCenterPt.z - scale * (subVecUpdated(pt2, forceCenterPt).z)
        )
        var pt3Offset = new THREE.Vector3(
            forceCenterPt.x - scale * (subVecUpdated(pt3, forceCenterPt).x),
            forceCenterPt.y - scale * (subVecUpdated(pt3, forceCenterPt).y),
            forceCenterPt.z - scale * (subVecUpdated(pt3, forceCenterPt).z)
        )
        var pt4Offset = new THREE.Vector3(
            forceCenterPt.x - scale * (subVecUpdated(pt4, forceCenterPt).x),
            forceCenterPt.y - scale * (subVecUpdated(pt4, forceCenterPt).y),
            forceCenterPt.z - scale * (subVecUpdated(pt4, forceCenterPt).z)
        )
        // green - 0x014F06
        var face123 = ForceFace3pt(pt1Offset, pt2Offset, pt3Offset, color123)
        cellgroup.add(face123)

        var face124 = ForceFace3pt(pt1Offset, pt2Offset, pt4Offset, color124)
        cellgroup.add(face124)

        var face234 = ForceFace3pt(pt2Offset, pt3Offset, pt4Offset, color234)
        cellgroup.add(face234)

        var face134 = ForceFace3pt(pt1Offset, pt3Offset, pt4Offset, color134)
        cellgroup.add(face134)

        cellgroup.add(createCylinderMesh(pt1Offset, pt2Offset, edge, 0.005, 0.005))
        cellgroup.add(createCylinderMesh(pt2Offset, pt3Offset, edge, 0.005, 0.005))
        cellgroup.add(createCylinderMesh(pt1Offset, pt3Offset, edge, 0.005, 0.005))
        cellgroup.add(createCylinderMesh(pt1Offset, pt4Offset, edge, 0.005, 0.005))
        cellgroup.add(createCylinderMesh(pt2Offset, pt4Offset, edge, 0.005, 0.005))
        cellgroup.add(createCylinderMesh(pt3Offset, pt4Offset, edge, 0.005, 0.005))

        return cellgroup
    }

    scene.add(form_group_v);
    scene.add(form_group_e);
    scene.add(form_group_c);
    scene.add(form_general);

    scene2.add(force_group_v);
    scene2.add(force_group_f);
    scene2.add(force_group_e);
    scene2.add(force_group_c);
    scene2.add(force_general);

    force_group_c.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = false;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = false;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = false;
        }
    });

    if (minkVisibilityCheckboxParams.show) {
        redrawMink();
    }
    if (forceCheckboxParams["force cell"]) {
        force_group_c.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = forceCheckboxParams["force cell"];
            }
        });
        force_group_f.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = !forceCheckboxParams["force cell"];
            }
            if (obj.type === "Sprite") {
                obj.material.visible = !forceCheckboxParams["force cell"];
            }
            if (obj.type === "Line") {
                obj.material.visible = !forceCheckboxParams["force cell"];
            }
        });
        force_general.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = !forceCheckboxParams["force cell"];
            }
            if (obj.type === "Sprite") {
                obj.material.visible = !forceCheckboxParams["force cell"];
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = !forceCheckboxParams["force cell"];
            }
            if (obj.type === "Line") {
                obj.material.visible = !forceCheckboxParams["force cell"];
            }
        });
    }
}

function initModel() {
    Redraw();
    trfm_ctrl = new THREE.TransformControls(camera, renderer.domElement);

    trfm_ctrl.addEventListener('change', render);
    trfm_ctrl.addEventListener('objectChange', function () {
        switch(selectObj.name.charAt(2)) {
            case '1':
                formBtPt1.x = selectObj.position.x;
                formBtPt1.y = selectObj.position.y;
                formBtPt1.z = selectObj.position.z;
                break;
            case '2':
                formBtPt2.x = selectObj.position.x;
                formBtPt2.y = selectObj.position.y;
                formBtPt2.z = selectObj.position.z;
                break;
            case '3':
                formBtPt3.x = selectObj.position.x;
                formBtPt3.y = selectObj.position.y;
                formBtPt3.z = selectObj.position.z;
                break;
            case '4':
                formBtPt4.x = selectObj.position.x;
                formBtPt4.y = selectObj.position.y;
                formBtPt4.z = selectObj.position.z;
                break;
            default:
                console.log("error in selecting object");
        }
        Redraw();
    })

    trfm_ctrl.addEventListener('mouseDown', () => {
        orbit_ctrl.enabled = false;

    });

    trfm_ctrl.addEventListener('mouseUp', () => {

        orbit_ctrl.enabled = true;
    });

    function onMouseDown(event) {

        //event.preventDefault();
        rayCaster.setFromCamera(mouse, camera);
        //var rayCaster = getRay(event);
        var intersects = rayCaster.intersectObjects(Ctrl_pts);

        if (event.button === 2) {
            trfm_ctrl.detach();
        }
        //document.addEventListener('mousemove', onMouseMove);

        if (event.button === 0 && intersects[0]) {
            selectObj = intersects[0].object;
            trfm_ctrl.attach(selectObj);

            // trfm_ctrl.position.update();
            // console.log(selectObj.position)
            // console.log(trfm_ctrl.position)
        }
    }

    function onMouseUp() {
        leftMouseDown = false;
        rightMouseDown = false;
        //document.removeEventListener('mousemove', onMouseMove);
    }

    function onMouseMove(event) {
        event.preventDefault();

        mouse.x = ((event.clientX * 2) / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(Ctrl_pts);

        if (intersects.length > 0) {
            $('html,body').css('cursor', 'pointer');
        } else {
            $('html,body').css('cursor', 'default');
        }
    }

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    document.oncontextmenu = function (event) {
        event.preventDefault();
    };

    scene.add(trfm_ctrl);

    //light setting
    var ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);
    scene2.add(ambient.clone());

    light = new THREE.DirectionalLight(0xffffff);
    // light.position.set( 1, 1, 1 ).normalize();
    light.position.set(0, 0, 10);
    light.shadow.camera.left = -2; // or whatever value works for the scale of scene
    light.shadow.camera.right = 2;
    light.shadow.camera.top = 2;
    light.shadow.camera.bottom = -2;
    light.shadow.camera.near = 0.01;
    light.shadow.camera.far = 200;
    light.castShadow = true;
    light.shadowMapHeight = 4096;
    light.shadowMapWidth = 4096;
    //light.shadow.map.width=512;
    //light.shadow.map.height=1000;

    scene.add(light);
    scene2.add(light.clone());

    // ground plane for shadow effects
    var FLOOR = -2.5;
    var geometry = new THREE.PlaneGeometry(100, 100);
    // var planeMaterial = new THREE.MeshLambertMaterial( { color: 0xdddddd } );
    const planeMaterial = new THREE.ShadowMaterial();
    planeMaterial.opacity = 0.2;
    var ground = new THREE.Mesh(geometry, planeMaterial);
    ground.position.set(0, 0, FLOOR);
    ground.rotation.x = 0;
    ground.scale.set(100, 100, 100);
    ground.castShadow = false;
    ground.receiveShadow = true;
    scene.add(ground);
    scene2.add(ground.clone());

}


// *********************** Basic settings ***********************

// ******** construct render setting
function initRender() {
    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setClearAlpha(0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    renderer.shadowMaptype = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;
    //renderer.setPixelRatio(devicePixelRatio);
    document.body.appendChild(renderer.domElement);//insert this into body
}

// ******** construct camera setting
function initCamera() {

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight * 2), 0.1, 200);
    camera.position.set(8, 0, 0);

    camera.up.x = 0;
    camera.up.y = 0;
    camera.up.z = 1;

    camera.lookAt({
        x: 0,
        y: 0,
        z: 0
    });

    //resize window to maintain the size of geometry
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / 2 / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// ********* scene setting
function initScene() {
    scene = new THREE.Scene();
    scene2 = new THREE.Scene();
}


var INTERSECTED;

let printPosition;

//rendering the scenes
function render() {
    let ctrlMin, ctrlMax;

    // x = red, y = green, z = blue

    if (selectObj != null) {
        switch(selectObj.name.charAt(2)) {
            case '1':
                ctrlMin = new THREE.Vector3(-1, -2, -1.25);
                ctrlMax = new THREE.Vector3(2, -1.5, -0.1);
                break;
            case '2':
                ctrlMin = new THREE.Vector3(-2, -1, -2);
                ctrlMax = new THREE.Vector3(-1.25, -0.25, -0.25);
                break;
            case '3':
                ctrlMin = new THREE.Vector3(-0.4, 0.5, -1.25);
                ctrlMax = new THREE.Vector3(1, 2, -0.5);
                break;
            case '4':
                ctrlMin = new THREE.Vector3(0.5, 0, -1.75);
                ctrlMax = new THREE.Vector3(2, 0.65, -0.7);
                break;
            default:
                console.log("error in selecting object");
        }
        selectObj.position.clamp(ctrlMin, ctrlMax);
        trfm_ctrl.position.clamp(ctrlMin, ctrlMax);
    }

    rayCaster.setFromCamera(mouse, camera);
    var intersects = rayCaster.intersectObjects(Ctrl_pts);

    if (intersects.length > 0) {//有相交的object时

        if (INTERSECTED != intersects[0].object) {

            if (INTERSECTED) //
            {
                INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
                if (event.button === 2) {
                    trfm_ctrl.detach();
                } else if (event.button === 0 && intersects[0]) {

                    selectObj = intersects[0].object;
                    //console.log("selectobj.name="+intersects[0].object.name.charAt(2));
                    trfm_ctrl.attach(selectObj);
                }

            }

            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            INTERSECTED.material.color.set(0xF0F02D);
        }
    } else {

        if (INTERSECTED) {
            INTERSECTED.material.color.set(INTERSECTED.currentHex);
        }
        INTERSECTED = null;
    }

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    renderer.clear();
    renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight)
    renderer.render(scene, camera);

    renderer.autoClear = false;
    renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight)
    renderer.render(scene2, camera);
}

//create recursive function to keep updating the animation
function animate() {
    requestAnimationFrame(animate);
    orbit_ctrl.update();
    render();
}

//call the recursive function
initRender();
initScene();
initCamera();
orbit_ctrl = new THREE.OrbitControls(camera, renderer.domElement);
orbit_ctrl.maxDistance = 50;
orbit_ctrl.minDistance = 1;
initModel();
// animate called in html file

// *************** support functions *******************


function create_force_face(point1, point2, pointO) {
    return new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(point1, pointO),
        new THREE.Vector3().subVectors(point2, pointO),
    ).length() / 2
}


function subVec(n1, n2) {
    var sub = new THREE.Vector3(0, 0, 0);
    sub.x = n1.x - n2.x;
    sub.y = n1.y - n2.y;
    sub.z = n1.z - n2.z;
    return sub;
}

function subVecUpdated(n2, n1) {
    var sub = new THREE.Vector3(0, 0, 0);
    sub.x = n1.x - n2.x;
    sub.y = n1.y - n2.y;
    sub.z = n1.z - n2.z;
    return sub;
}


function cross(n1, n2) {
    var ncross = new THREE.Vector3(0, 0, 0);
    ncross.x = ((n1.y * n2.z) - (n1.z * n2.y));
    ncross.y = ((n1.z * n2.x) - (n1.x * n2.z));
    ncross.z = ((n1.x * n2.y) - (n1.y * n2.x));
    return ncross;

}

function Pnt_copy(n1) {

    var n2 = new THREE.Vector3(0, 0, 0);
    n2.x = n1.x;
    n2.y = n1.y;
    n2.z = n1.z;
    return n2;
}

function norm(n1) {
    return Math.sqrt(n1.x * n1.x + n1.y * n1.y + n1.z * n1.z);
}

function LinesSectPt(L1_dir, P1_pnt, L2_dir, P2_pnt) {

    var L1_dir1 = Pnt_copy(L1_dir);
    var L2_dir2 = Pnt_copy(L2_dir);

    L1_dir1.x = L1_dir.x / norm(L1_dir);
    L1_dir1.y = L1_dir.y / norm(L1_dir);

    L2_dir2.x = L2_dir.x / norm(L2_dir);
    L2_dir2.y = L2_dir.y / norm(L2_dir);
    L2_dir2.z = L2_dir.z / norm(L2_dir);


    var P1P2_Vec = new THREE.Vector3(0, 0, 0);
    P1P2_Vec.x = P2_pnt.x - P1_pnt.x;
    P1P2_Vec.y = P2_pnt.y - P1_pnt.y;
    P1P2_Vec.z = P2_pnt.z - P1_pnt.z;


    var P2P3_Norm = norm(cross(P1P2_Vec, L1_dir1));


    var P3_pnt = new THREE.Vector3(0, 0, 0);

    P3_pnt.x = P1_pnt.x + ((P1P2_Vec.x * L1_dir1.x + P1P2_Vec.y * L1_dir1.y + P1P2_Vec.z * L1_dir1.z)) * L1_dir1.x;
    P3_pnt.y = P1_pnt.y + ((P1P2_Vec.x * L1_dir1.x + P1P2_Vec.y * L1_dir1.y + P1P2_Vec.z * L1_dir1.z)) * L1_dir1.y;
    P3_pnt.z = P1_pnt.z + ((P1P2_Vec.x * L1_dir1.x + P1P2_Vec.y * L1_dir1.y + P1P2_Vec.z * L1_dir1.z)) * L1_dir1.z;

    var CosTheta = Math.abs(L1_dir1.x * L2_dir2.x + L1_dir1.y * L2_dir2.y + L1_dir1.z * L2_dir2.z);


    var k_pnt = new THREE.Vector3(0, 0, 0);

    if (CosTheta < 0) {
        k_pnt = Pnt_copy(P3_pnt);

    }

    if (CosTheta > 0) {
        var Tantheta = Math.sqrt((1 - Math.pow(CosTheta, 2))) / CosTheta;
        var KP3_Norm = P2P3_Norm / Tantheta;

        var K1_pnt = new THREE.Vector3((P3_pnt.x + KP3_Norm * L1_dir1.x), (P3_pnt.y + KP3_Norm * L1_dir1.y), (P3_pnt.z + KP3_Norm * L1_dir1.z));
        var K2_pnt = new THREE.Vector3((P3_pnt.x - KP3_Norm * L1_dir1.x), (P3_pnt.y - KP3_Norm * L1_dir1.y), (P3_pnt.z - KP3_Norm * L1_dir1.z));


        var P2K1_vec = new THREE.Vector3((K1_pnt.x - P2_pnt.x), (K1_pnt.y - P2_pnt.y), (K1_pnt.z - P2_pnt.z));
        var P2K2_vec = new THREE.Vector3((K2_pnt.x - P2_pnt.x), (K2_pnt.y - P2_pnt.y), (K2_pnt.z - P2_pnt.z));

        var D1 = norm(cross(P2K1_vec, L2_dir2));
        var D2 = norm(cross(P2K2_vec, L2_dir2));


        if (D1 < D2)
            k_pnt = Pnt_copy(K1_pnt);
        else
            k_pnt = Pnt_copy(K2_pnt);

    }

    return k_pnt;


}


// ****************** normal directions *******************
function CalNormalVector(vec1, vec2, vec3, n) {

    const VecCB = new THREE.Vector3();
    const VecAB = new THREE.Vector3();
    const normal = new THREE.Vector3();
    VecCB.subVectors(vec1, vec2);
    VecAB.subVectors(vec3, vec2);
    VecAB.cross(VecCB);
    normal.copy(VecAB).normalize();

    return new THREE.Vector3(n * normal.x, n * normal.y, n * normal.z);
}

function CalNormalVectorUpdated(vec1, vec2, vec3, n) {

    const VecCB = new THREE.Vector3();
    const VecAB = new THREE.Vector3();
    const normal = new THREE.Vector3();
    VecCB.subVectors(vec1, vec2);
    VecAB.subVectors(vec2, vec3);
    VecAB.cross(VecCB);
    normal.copy(VecAB).normalize();

    return new THREE.Vector3(n * normal.x, n * normal.y, n * normal.z);
}


//****************** arrow *****************************
function addVectorAlongDir(pt1, pt2, len) {
    var C = new THREE.Vector3();
    C.subVectors(pt2, pt1).multiplyScalar(1 + (len / C.length())).add(pt1);
    return C
}

//****************** arrow *****************************
function createCylinderArrowMesh(pointX, pointY, material, radius, radiusCone, edgeLengthRatio) {
    var arrows = new THREE.Group();
    var direction = new THREE.Vector3().subVectors(pointY, pointX);
    var l = direction.length();
    if (radius === undefined) {
        radius = l * 0.01;
    }
// fixedConeLength = fixedConeLength !== undefined ? fixedConeLength : 4;
    if (radiusCone === undefined) {
        radiusCone = 2 * radius;
    }
// edgeLengthRatio = edgeLengthRatio !== undefined ? edgeLengthRatio : 0.7 ;
    var orientation = new THREE.Matrix4();
    orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
    orientation.multiply(new THREE.Matrix4().set
    (1, 0, 0, 0,
        0, 0, 1, 0,
        0, -1, 0, 0,
        0, 0, 0, 1));

    var edgeGeometry;
    var coneGeometry;
    if (edgeLengthRatio !== undefined) {
        edgeGeometry = new THREE.CylinderGeometry(radius, radius, edgeLengthRatio * l, 8, 1);
        coneGeometry = new THREE.CylinderGeometry(0, radiusCone, (1 - edgeLengthRatio) * l, 8, 1);
        edgeGeometry.translate(0, -(0.5 - 0.5 * edgeLengthRatio) * l, 0);
        coneGeometry.translate(0, (0.5 - 0.5 * (1 - edgeLengthRatio)) * l, 0);

    } else {
        // fixed length cone
        var fixedConeLength = 1;
        edgeGeometry = new THREE.CylinderGeometry(radius, radius, l - fixedConeLength, 8, 1);
        coneGeometry = new THREE.CylinderGeometry(0, radiusCone, fixedConeLength, 8, 1);
        edgeGeometry.translate(0, -0.5 * fixedConeLength, 0);
        coneGeometry.translate(0, 0.5 * (l - fixedConeLength), 0);

    }
    var arrow = new THREE.Mesh(edgeGeometry, material);
    arrow.applyMatrix4(orientation);
    arrow.position.x = (pointY.x + pointX.x) / 2;
    arrow.position.y = (pointY.y + pointX.y) / 2;
    arrow.position.z = (pointY.z + pointX.z) / 2;

    var arrow2 = new THREE.Mesh(coneGeometry, material);
    arrow2.applyMatrix4(orientation);
    arrow2.position.x = (pointY.x + pointX.x) / 2;
    arrow2.position.y = (pointY.y + pointX.y) / 2;
    arrow2.position.z = (pointY.z + pointX.z) / 2;

    arrows.add(arrow);
    arrows.add(arrow2);
    return arrows;
}

//****************** cylinder *****************************
function createCylinderMesh(pointX, pointY, material1, radius, radius2) {
    if (radius === undefined) {
        radius = 1;
    }
    if (radius2 === undefined) {
        radius2 = radius;
    }
    var direction = new THREE.Vector3().subVectors(pointY, pointX);
    var orientation = new THREE.Matrix4();
    orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
    orientation.multiply(new THREE.Matrix4().set
    (1, 0, 0, 0,
        0, 0, 1, 0,
        0, -1, 0, 0,
        0, 0, 0, 1));
    var edgeGeometry = new THREE.CylinderGeometry(radius, radius2, direction.length(), 40, 1);
    var edge = new THREE.Mesh(edgeGeometry, material1);
    edge.applyMatrix4(orientation);
// position based on midpoints - there may be a better solution than this
    edge.position.x = (pointY.x + pointX.x) / 2;
    edge.position.y = (pointY.y + pointX.y) / 2;
    edge.position.z = (pointY.z + pointX.z) / 2;
//console.log("pos=", edge.position.x);
    edge.castShadow = true;
    return edge;
}

//***************** construct form vertices ***********************
function addVertice(size, name, location) {
    var pt_material = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
    var pt_geo = new THREE.SphereGeometry(size);
    var pt_sphere = new THREE.Mesh(pt_geo, pt_material);

    pt_sphere.name = name;
    pt_sphere.position.copy(location);
    pt_sphere.castShadow = true;

    return pt_sphere
}

//construct vertices outlines
function addVerticeOut(size, location, scale) {
    var pt_material_outline = new THREE.MeshBasicMaterial({
        color: "black",
        transparent: false,
        side: THREE.BackSide
    });
    var pt_geo = new THREE.SphereGeometry(size);
    var pt_geo_outline = new THREE.Mesh(pt_geo, pt_material_outline);
    pt_geo_outline.position.copy(location);
    pt_geo_outline.scale.multiplyScalar(scale);

    return pt_geo_outline
}

//***************** construct form edge ***********************
function addEdgeSphere(size, location, color) {
    var pt_material = new THREE.MeshPhongMaterial({color: color, transparent: false});
    var pt_geo = new THREE.SphereGeometry(size);
    var pt_sphere = new THREE.Mesh(pt_geo, pt_material);

    pt_sphere.position.copy(location);
    pt_sphere.castShadow = true;

    return pt_sphere
}


//***************** construct faces ***********************
//form faces - green color
function ForceFace3ptGreen(pt1, pt2, pt3) {

    let geometry = new THREE.BufferGeometry()
    const points = [
        pt1,
        pt2,
        pt3,
    ]

    geometry.setFromPoints(points)
    geometry.computeVertexNormals()
    const material_greenfaces = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        // new THREE.MeshBasicMaterial({ color: "white", wireframe: true, transparent: true, opacity: 1 }),
        new THREE.MeshPhongMaterial({
            color: 0x014F06, transparent: true, opacity: 0.4, side: THREE.DoubleSide,
            //depthWrite: false
        })
    ];

    return new THREE.SceneUtils.createMultiMaterialObject(geometry, material_greenfaces)
}

//form faces - grey color
function FormFace3ptGR(pt1, pt2, pt3) {

    let geometry = new THREE.BufferGeometry()
    const points = [
        pt1,
        pt2,
        pt3,
    ]

    geometry.setFromPoints(points)
    geometry.computeVertexNormals()
    const material_greenfaces = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.8}),
        new THREE.MeshPhongMaterial({
            color: 0x808080, transparent: true, opacity: 0.15, side: THREE.DoubleSide, depthWrite: false
        })
    ];

    return new THREE.SceneUtils.createMultiMaterialObject(geometry, material_greenfaces)
}

//force faces
function ForceFace3pt(pt1, pt2, pt3, color) {

    let geometry = new THREE.BufferGeometry()
    const points = [
        pt1,
        pt2,
        pt3,
    ]

    geometry.setFromPoints(points)
    geometry.computeVertexNormals()
    const material_greenfaces = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        //new THREE.MeshBasicMaterial({ color: "white", wireframe: true, transparent: true, opacity: 0.8 }),
        new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
            depthWrite: false
        })
    ];

    return new THREE.SceneUtils.createMultiMaterialObject(geometry, material_greenfaces)
}


function FormPlane(pt1, pt2, pt3, pt4) {

    let geometry = new THREE.BufferGeometry()
    const points = [
        pt1,
        pt2,
        pt3,

        pt1,
        pt3,
        pt4,
    ]

    geometry.setFromPoints(points)
    geometry.computeVertexNormals()
    const material_greenfaces = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        //new THREE.MeshBasicMaterial({ color: "black", wireframe: false, transparent: true, opacity: 0.4 }),
        new THREE.MeshPhongMaterial({
            color: "darkgrey", transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false
        })
    ];

    return new THREE.SceneUtils.createMultiMaterialObject(geometry, material_greenfaces)
}


//force faces - green color
function ForceFace4ptGN(pt1, pt2, pt3, pt4) {


    let geometry = new THREE.BufferGeometry()
    const points = [
        pt1,
        pt2,
        pt3,

        pt1,
        pt3,
        pt4,
    ]

    geometry.setFromPoints(points)
    geometry.computeVertexNormals()
    const material_greenfaces = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "black", wireframe: true, transparent: true, opacity: 0.8}),
        new THREE.MeshPhongMaterial({
            color: 0x009600, transparent: true, opacity: 0.15, side: THREE.DoubleSide, depthWrite: false
        })
    ];

    return new THREE.SceneUtils.createMultiMaterialObject(geometry, material_greenfaces)
}

function FormFace4ptGN(pt1, pt2, pt3, pt4) {


    let geometry = new THREE.BufferGeometry()
    const points = [
        pt1,
        pt2,
        pt3,

        pt1,
        pt3,
        pt4,
    ]

    geometry.setFromPoints(points)
    geometry.computeVertexNormals()
    const material_greenfaces = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        //new THREE.MeshBasicMaterial({ color: 0x009600, wireframe: false, transparent: true, opacity: 0.1}),
        new THREE.MeshPhongMaterial({
            color: 0x009600, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false
        })
    ];

    return new THREE.SceneUtils.createMultiMaterialObject(geometry, material_greenfaces)
}

//force trial faces - grey color
function ForceTrialFace(pt1, pt2, pt3, pt4, ptO) {

    let geometry = new THREE.BufferGeometry()
    const points = [
        pt1,
        pt2,
        ptO,

        pt2,
        pt3,
        ptO,

        pt3,
        pt4,
        ptO,

        pt1,
        pt4,
        ptO,

        pt1,
        pt3,
        ptO,
    ]

    geometry.setFromPoints(points)
    geometry.computeVertexNormals()
    const material_greenfaces = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.2}),
        new THREE.MeshPhongMaterial({
            color: "grey", transparent: true, opacity: 0.15, side: THREE.DoubleSide, depthWrite: false
        })
    ];

    return new THREE.SceneUtils.createMultiMaterialObject(geometry, material_greenfaces)
}

//***************** construct dash lines ***********************
function dashLinesGR(pt1, pt2, sizein, sizeout, scale) {

    var dashline = new THREE.Group();

    var dashlineMaterial = new THREE.MeshPhongMaterial({
        color: 0x009600//green
    });
    var dashlineMaterial_out = new THREE.MeshBasicMaterial({
        color: "white",
        transparent: false,
        side: THREE.BackSide
    });

    var od1 = pt1.distanceTo(pt2);

    var dl0 = new THREE.Vector3((pt1.x + (pt2.x - pt1.x) * 0.08 / od1), (pt1.y + (pt2.y - pt1.y) * 0.08 / od1), (pt1.z + (pt2.z - pt1.z) * 0.08 / od1));
    var dl1 = new THREE.Vector3((pt1.x + (pt2.x - pt1.x) * 0.25 / od1), (pt1.y + (pt2.y - pt1.y) * 0.25 / od1), (pt1.z + (pt2.z - pt1.z) * 0.25 / od1));

    var dl2 = new THREE.Vector3((pt1.x + (pt2.x - pt1.x) * 0.28 / od1), (pt1.y + (pt2.y - pt1.y) * 0.28 / od1), (pt1.z + (pt2.z - pt1.z) * 0.28 / od1));
    var dl3 = new THREE.Vector3((pt1.x + (pt2.x - pt1.x) * 0.45 / od1), (pt1.y + (pt2.y - pt1.y) * 0.45 / od1), (pt1.z + (pt2.z - pt1.z) * 0.45 / od1));

    var dl4 = new THREE.Vector3((pt1.x + (pt2.x - pt1.x) * 0.48 / od1), (pt1.y + (pt2.y - pt1.y) * 0.48 / od1), (pt1.z + (pt2.z - pt1.z) * 0.48 / od1));
    var dl5 = new THREE.Vector3((pt1.x + (pt2.x - pt1.x) * 0.65 / od1), (pt1.y + (pt2.y - pt1.y) * 0.65 / od1), (pt1.z + (pt2.z - pt1.z) * 0.65 / od1));

    var dl6 = new THREE.Vector3((pt1.x + (pt2.x - pt1.x) * 0.68 / od1), (pt1.y + (pt2.y - pt1.y) * 0.68 / od1), (pt1.z + (pt2.z - pt1.z) * 0.68 / od1));
    var dl7 = new THREE.Vector3((pt1.x + (pt2.x - pt1.x) * 0.85 / od1), (pt1.y + (pt2.y - pt1.y) * 0.85 / od1), (pt1.z + (pt2.z - pt1.z) * 0.85 / od1));

    var dl8 = new THREE.Vector3((pt1.x + (pt2.x - pt1.x) * 0.88 / od1), (pt1.y + (pt2.y - pt1.y) * 0.88 / od1), (pt1.z + (pt2.z - pt1.z) * 0.88 / od1));

    var al1 = createCylinderMesh(dl0, dl1, dashlineMaterial, sizein, sizein);
    var al1Out = createCylinderMesh(dl0, dl1, dashlineMaterial_out, sizeout, sizeout);
    al1Out.scale.multiplyScalar(scale);
    dashline.add(al1);
    dashline.add(al1Out);

    var al2 = createCylinderMesh(dl2, dl3, dashlineMaterial, sizein, sizein);
    var al2Out = createCylinderMesh(dl2, dl3, dashlineMaterial_out, sizeout, sizeout);
    al2Out.scale.multiplyScalar(scale);
    dashline.add(al2);
    dashline.add(al2Out);

    var al3 = createCylinderMesh(dl4, dl5, dashlineMaterial, sizein, sizein);
    var al3Out = createCylinderMesh(dl4, dl5, dashlineMaterial_out, sizeout, sizeout);
    al3Out.scale.multiplyScalar(scale);
    dashline.add(al3);
    dashline.add(al3Out);

    var al4 = createCylinderMesh(dl6, dl7, dashlineMaterial, sizein, sizein);
    var al4Out = createCylinderMesh(dl6, dl7, dashlineMaterial_out, sizeout, sizeout);
    al4Out.scale.multiplyScalar(scale);
    dashline.add(al4);
    dashline.add(al4Out);

    var al5 = createCylinderMesh(dl8, pt2, dashlineMaterial, sizein, sizein);
    var al5Out = createCylinderMesh(dl8, pt2, dashlineMaterial_out, sizeout, sizeout);
    al5Out.scale.multiplyScalar(scale);
    dashline.add(al5);
    dashline.add(al5Out);
    return dashline
}

function addCell3Face(point1, point2, point3, point4, scale) {

    var centroid = new THREE.Vector3((point1.x + point2.x + point3.x + point4.x) / 4, (point1.y + point2.y + point3.y + point4.y) / 4, (point1.z + point2.z + point3.z + point4.z) / 4);


    var scale_point1 = new THREE.Vector3(centroid.x + (point1.x - centroid.x) * scale, centroid.y + (point1.y - centroid.y) * scale, centroid.z + (point1.z - centroid.z) * scale);


    var scale_point2 = new THREE.Vector3(centroid.x + (point2.x - centroid.x) * scale, centroid.y + (point2.y - centroid.y) * scale, centroid.z + (point2.z - centroid.z) * scale);


    var scale_point3 = new THREE.Vector3(centroid.x + (point3.x - centroid.x) * scale, centroid.y + (point3.y - centroid.y) * scale, centroid.z + (point3.z - centroid.z) * scale);

    var scale_point4 = new THREE.Vector3(centroid.x + (point4.x - centroid.x) * scale, centroid.y + (point4.y - centroid.y) * scale, centroid.z + (point4.z - centroid.z) * scale);


    let geometry = new THREE.BufferGeometry()
    const points = [
        scale_point1,
        scale_point2,
        scale_point3,

        scale_point1,
        scale_point3,
        scale_point4,

        scale_point1,
        scale_point2,
        scale_point4,
    ]

    geometry.setFromPoints(points)
    geometry.computeVertexNormals()

    var material = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.7}),
        new THREE.MeshPhongMaterial({
            color: "darkgrey", transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false
        })
    ];

    var cell = new THREE.SceneUtils.createMultiMaterialObject(geometry, material);
    cell.castShadow = true;

    return cell

}


function addCell4Face(point1, point2, point3, point4, scale) {

    var centroid = new THREE.Vector3((point1.x + point2.x + point3.x + point4.x) / 4, (point1.y + point2.y + point3.y + point4.y) / 4, (point1.z + point2.z + point3.z + point4.z) / 4);


    var scale_point1 = new THREE.Vector3(centroid.x + (point1.x - centroid.x) * scale, centroid.y + (point1.y - centroid.y) * scale, centroid.z + (point1.z - centroid.z) * scale);


    var scale_point2 = new THREE.Vector3(centroid.x + (point2.x - centroid.x) * scale, centroid.y + (point2.y - centroid.y) * scale, centroid.z + (point2.z - centroid.z) * scale);


    var scale_point3 = new THREE.Vector3(centroid.x + (point3.x - centroid.x) * scale, centroid.y + (point3.y - centroid.y) * scale, centroid.z + (point3.z - centroid.z) * scale);

    var scale_point4 = new THREE.Vector3(centroid.x + (point4.x - centroid.x) * scale, centroid.y + (point4.y - centroid.y) * scale, centroid.z + (point4.z - centroid.z) * scale);


    let geometry = new THREE.BufferGeometry()
    const points = [
        scale_point1,
        scale_point2,
        scale_point3,

        scale_point1,
        scale_point3,
        scale_point4,

        scale_point1,
        scale_point2,
        scale_point4,

        scale_point2,
        scale_point3,
        scale_point4,
    ]

    geometry.setFromPoints(points)
    geometry.computeVertexNormals()

    var material = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.7}),
        new THREE.MeshPhongMaterial({
            color: "darkgrey", side: THREE.DoubleSide,
            // depthWrite:false,
            // transparent: true,opacity:1,
        })
    ];

    var cell = new THREE.SceneUtils.createMultiMaterialObject(geometry, material);
    cell.castShadow = true;

    return cell

}

function create_trial_intec(startpoint, forceP1, forceP2, forceP3, intecP1, intecP1B) {

    var startpoint

    var trial_startpoint_vec = CalNormalVector(forceP1, forceP2, forceP3, 0.5);
    var trial_startpoint_intec_temp = new THREE.Vector3(startpoint.x - 1.2 * trial_startpoint_vec.x, startpoint.y - 1.2 * trial_startpoint_vec.y, startpoint.z - 1.2 * trial_startpoint_vec.z);

    var dirtsP = new THREE.Vector3(); // create once an reuse it

    dirtsP.subVectors(startpoint, trial_startpoint_intec_temp).normalize();

    var dirto = new THREE.Vector3(); // create once an reuse it

    dirto.subVectors(intecP1, intecP1B).normalize();

    return LinesSectPt(dirtsP, startpoint, dirto, intecP1)
}

function createdashline(point1, point2) {

    var dashline = [];
    dashline.push(point1);
    dashline.push(point2);

    var dashline_geo = new THREE.BufferGeometry().setFromPoints(dashline);

    var trialline_dash = new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.1,
        gapSize: 0.03,
        linewidth: 1

    });

    var dashline_edges = new THREE.LineSegments(dashline_geo, trialline_dash);
    dashline_edges.computeLineDistances();//compute
    return dashline_edges
}

function Cal_Plane_Line_Intersect_Point(Point_online, LineVec, Point_onPlane, PlaneVec) {
    return new THREE.Vector3(
        //x
        Point_online.x + LineVec.x * ((Point_onPlane.x - Point_online.x) * PlaneVec.x + (Point_onPlane.y - Point_online.y) * PlaneVec.y + (Point_onPlane.z - Point_online.z) * PlaneVec.z) / (PlaneVec.x * LineVec.x + PlaneVec.y * LineVec.y + PlaneVec.z * LineVec.z),
        //y
        Point_online.y + LineVec.y * ((Point_onPlane.x - Point_online.x) * PlaneVec.x + (Point_onPlane.y - Point_online.y) * PlaneVec.y + (Point_onPlane.z - Point_online.z) * PlaneVec.z) / (PlaneVec.x * LineVec.x + PlaneVec.y * LineVec.y + PlaneVec.z * LineVec.z),
        //z
        Point_online.z + LineVec.z * ((Point_onPlane.x - Point_online.x) * PlaneVec.x + (Point_onPlane.y - Point_online.y) * PlaneVec.y + (Point_onPlane.z - Point_online.z) * PlaneVec.z) / (PlaneVec.x * LineVec.x + PlaneVec.y * LineVec.y + PlaneVec.z * LineVec.z));
}

function ForceFace(pt0, pt1, pt2, pt3, pt4, pt5) {

    let geometry = new THREE.BufferGeometry()
    const points = [
        pt0,
        pt1,
        pt5,

        pt1,
        pt2,
        pt5,

        pt0,
        pt2,
        pt5,

        pt0,
        pt3,
        pt4,

        pt2,
        pt3,
        pt4,

        pt0,
        pt2,
        pt4,

        pt2,
        pt4,
        pt5,

        pt0,
        pt4,
        pt5,
    ]

    geometry.setFromPoints(points)
    geometry.computeVertexNormals()
    const material_greenfaces = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "black", wireframe: true, transparent: false, opacity: 0.01}),
        new THREE.MeshPhongMaterial({
            color: 0x009600, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false
        })
    ];

    var mesh = new THREE.SceneUtils.createMultiMaterialObject(geometry, material_greenfaces);
    mesh.children[0].castShadow = true;
    return mesh
}


function face_center(n1, n2, n3) {

    var face_centerD = new THREE.Vector3();

    face_centerD.x = (n1.x + n2.x + n3.x) / 3;
    face_centerD.y = (n1.y + n2.y + n3.y) / 3;
    face_centerD.z = (n1.z + n2.z + n3.z) / 3;

    return face_centerD;

}

function createSpriteText(text, text2, pos) {
    //canvas
    var canvas = document.createElement("canvas");
    canvas.width = 440;
    canvas.height = 340;
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.font = "80px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text, 150, 150);

    ctx.fillStyle = "black";
    ctx.font = "30px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text2, 220, 157);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    //text
    var material = new THREE.SpriteMaterial({map: texture, depthWrite: false});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.7, 0.7, 0.7);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x  //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y
    textObj.position.z = pos.z


    return textObj;
}

function createCircleFaceArrow(centerPt, radius, arr_dir) {
    var Vec_a = cross(arr_dir, new THREE.Vector3(1, 0, 0));
    if (Vec_a.x === 0 && Vec_a.y === 0 && Vec_a.z === 0) {
        Vec_a = cross(arr_dir, new THREE.Vector3(0, 1, 0));
    }
    var Vec_b = cross(arr_dir, Vec_a);
    Vec_a.normalize();
    Vec_b.normalize();
    // console.log("vec_a,vec_b",Vec_a,Vec_b);
    var points = [];
    var length = 20;
    for (var i = 0; i <= length; i++) {
        var Pts_Circle = new THREE.Vector3(0, 0, 0);
        Pts_Circle.x = centerPt.x + radius * Vec_a.x * Math.cos(Math.PI * 1.5 * i / length) + radius * Vec_b.x * Math.sin(Math.PI * 1.5 * i / length);
        Pts_Circle.y = centerPt.y + radius * Vec_a.y * Math.cos(Math.PI * 1.5 * i / length) + radius * Vec_b.y * Math.sin(Math.PI * 1.5 * i / length);
        Pts_Circle.z = centerPt.z + radius * Vec_a.z * Math.cos(Math.PI * 1.5 * i / length) + radius * Vec_b.z * Math.sin(Math.PI * 1.5 * i / length);
        points.push(Pts_Circle);
    }
    var geometrySpacedPoints = new THREE.BufferGeometry().setFromPoints(points);
    //var line2 = new THREE.Line( geometrySpacedPoints, material);
    var arcMaterial = new THREE.LineDashedMaterial({
        color: 0x00ff00,
        dashSize: 0.1,
        gapSize: 0.05
    });
    var CircleMesh = new THREE.Line(geometrySpacedPoints, arcMaterial);
    //console.log("points=",points[1],points[5]);
    CircleMesh.computeLineDistances();//dash
    var arrow_material1 = new THREE.MeshBasicMaterial({
        color: "white"//green
    });
    // var CircleMesh=createCylinderMesh(points[0],points[1],arrow_material1,0.02,0.02);
    for (i = 0; i < length; i++) {
        var CircleMesh1 = createCylinderMesh(points[i], points[i + 1], arrow_material1, 0.005, 0.005);
        CircleMesh1.castShadow = false;
        CircleMesh.add(CircleMesh1);
    }
    var Arr_Pt1 = new THREE.Vector3(0, 0, 0);
    Arr_Pt1.x = centerPt.x + radius * Vec_a.x * Math.cos(Math.PI * 1.6 * i / length) + radius * Vec_b.x * Math.sin(Math.PI * 1.6 * i / length);
    Arr_Pt1.y = centerPt.y + radius * Vec_a.y * Math.cos(Math.PI * 1.6 * i / length) + radius * Vec_b.y * Math.sin(Math.PI * 1.6 * i / length);
    Arr_Pt1.z = centerPt.z + radius * Vec_a.z * Math.cos(Math.PI * 1.6 * i / length) + radius * Vec_b.z * Math.sin(Math.PI * 1.6 * i / length);
    var face_arrow1 = createCylinderArrowMesh(points[length], Arr_Pt1, arrow_material1, 0.01, 0.02, 0.01);
    CircleMesh.add(face_arrow1);
    return CircleMesh;
}

function ForceFaceNormalsArrow(midPt, pt1, pt2, length, normal_apply, normal_apply_outline, number, dir) {
    if (dir == true) {
        var arrow_group = new THREE.Group()
        var step3faceNormal1 = facenormal(midPt, pt1, pt2, length);
        var facecenter = face_center(midPt, pt1, pt2);
        var ABarrow1Vect = new THREE.Vector3(step3faceNormal1.x + facecenter.x, step3faceNormal1.y + facecenter.y, step3faceNormal1.z + facecenter.z);
        var formABarrow1 = createCylinderArrowMesh(facecenter, ABarrow1Vect, normal_apply, 0.02, 0.05, 0.6);
        arrow_group.add(formABarrow1)
        var ABDarrow12 = createCylinderArrowMesh(facecenter, ABarrow1Vect, normal_apply_outline, 0.03, 0.063, 0.59);
        arrow_group.add(ABDarrow12);
        var TXfaceNormal1 = createSpriteTextApply('n', number, new THREE.Vector3(ABarrow1Vect.x, ABarrow1Vect.y, ABarrow1Vect.z + 0.1));
        arrow_group.add(TXfaceNormal1);
    }
    if (dir == false) {
        var arrow_group = new THREE.Group()
        var step3faceNormal1 = facenormal(midPt, pt1, pt2, -length);
        var facecenter = face_center(midPt, pt1, pt2);
        var ABarrow1Vect = new THREE.Vector3(step3faceNormal1.x + facecenter.x, step3faceNormal1.y + facecenter.y, step3faceNormal1.z + facecenter.z);
        var formABarrow1 = createCylinderArrowMesh(ABarrow1Vect, facecenter, normal_apply, 0.02, 0.05, 0.6);
        arrow_group.add(formABarrow1)
        var ABDarrow12 = createCylinderArrowMesh(ABarrow1Vect, facecenter, normal_apply_outline, 0.03, 0.063, 0.59);
        arrow_group.add(ABDarrow12);
        var TXfaceNormal1 = createSpriteTextApply('n', number, new THREE.Vector3(ABarrow1Vect.x, ABarrow1Vect.y, ABarrow1Vect.z + 0.1));
        arrow_group.add(TXfaceNormal1);
    }
    return arrow_group
}

function facenormal(pt1, pt2, pt3, k) {
    var cb = new THREE.Vector3();
    var ab = new THREE.Vector3();
    var normal1 = new THREE.Vector3();
    cb.subVectors(pt1, pt2);
    ab.subVectors(pt3, pt1);
    cb.cross(ab);
    normal1.copy(cb).normalize();
    return new THREE.Vector3(k * normal1.x, k * normal1.y, k * normal1.z)
}

function createSpriteTextApply(text, text2, pos) {
    //canvas
    var canvas = document.createElement("canvas");
    canvas.width = 440;
    canvas.height = 340;
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.font = "Bold 80px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text, 150, 150);

    ctx.fillStyle = "black";
    ctx.font = "30px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text2, 210, 157);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    //text
    var material = new THREE.SpriteMaterial({map: texture, depthWrite: false});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.9, 0.9, 0.9);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x  //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y
    textObj.position.z = pos.z


    return textObj;
}

function createSpriteTextPrime(text, text2, pos) {
    //canva
    var canvas = document.createElement("canvas");
    canvas.width = 440;
    canvas.height = 340;
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.font = "80px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text, 150, 150);

    ctx.fillStyle = "black";
    ctx.font = "30px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text2, 210, 110);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    //text
    var material = new THREE.SpriteMaterial({map: texture, depthWrite: false});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.7, 0.7, 0.7);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x  //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y
    textObj.position.z = pos.z


    return textObj;
}

function addVerticeSup(size, name, location) {
    var pt_material = new THREE.MeshPhongMaterial({color: "black", transparent: false});
    var pt_geo = new THREE.SphereGeometry(size);
    var pt_sphere = new THREE.Mesh(pt_geo, pt_material);

    pt_sphere.name = name;
    pt_sphere.position.copy(location);
    pt_sphere.castShadow = true;

    return pt_sphere
}

function addVerticeOutSup(size, location, scale) {
    var pt_material_outline = new THREE.MeshBasicMaterial({
        color: "white",
        transparent: false,
        side: THREE.BackSide
    });
    var pt_geo = new THREE.SphereGeometry(size);
    var pt_geo_outline = new THREE.Mesh(pt_geo, pt_material_outline);
    pt_geo_outline.position.copy(location);
    pt_geo_outline.scale.multiplyScalar(scale);

    return pt_geo_outline
}

function minkFace4pt(pt1, pt2, pt3, pt4, color) {


    let geometry = new THREE.BufferGeometry()
    const points = [
        pt1,
        pt2,
        pt3,

        pt1,
        pt3,
        pt4,
    ]

    geometry.setFromPoints(points)
    geometry.computeVertexNormals()
    const material_greenfaces = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        //new THREE.MeshBasicMaterial({ color: 0x009600, wireframe: false, transparent: true, opacity: 0.1}),
        new THREE.MeshPhongMaterial({
            color: color, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false
        })
    ];

    return new THREE.SceneUtils.createMultiMaterialObject(geometry, material_greenfaces)
}

function minkFace3pt(pt1, pt2, pt3, color) {


    let geometry = new THREE.BufferGeometry()
    const points = [
        pt1,
        pt2,
        pt3,
    ]

    geometry.setFromPoints(points)
    geometry.computeVertexNormals()
    const material_greenfaces = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        //new THREE.MeshBasicMaterial({ color: 0x009600, wireframe: false, transparent: true, opacity: 0.1}),
        new THREE.MeshPhongMaterial({
            color: color, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false
        })
    ];

    return new THREE.SceneUtils.createMultiMaterialObject(geometry, material_greenfaces)
}