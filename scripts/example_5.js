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

var showTrial = false;
var trialHeight = 2;


//*********************** testing new UI (tweakpane) *********************

/** MOVABLE LEFT DIV **/

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

//creating the first pane (left)
const paneLeft = new Tweakpane.Pane({
    container: document.getElementById('left_container'),
});

const tab = paneLeft.addTab({
    pages: [
        {title: 'Parameters'},
        {title: 'Initial'}
    ],
});

//tweakpane - left panel (second tab)

const offsetSliderParams = {
    GDoF1: 0.4, //starts as double the size of the box's params
};
//make the plane size slider
tab.pages[0].addInput(offsetSliderParams, 'GDoF1', {
    min: 0.001, //min = double the size of the box's params
    max: 0.8, //max = quadruple the size of the box's params
}).on('change', (ev) => { //on change, dispose old plane geometry and create new
    offsetscale.l = ev.value;
    Redraw();
});

const offsetSlider2Params = {
    GDoF2: 0.4, //starts as double the size of the box's params
};
//make the plane size slider
tab.pages[0].addInput(offsetSlider2Params, 'GDoF2', {
    min: 0.001, //min = double the size of the box's params
    max: 1.2, //max = quadruple the size of the box's params
}).on('change', (ev) => { //on change, dispose old plane geometry and create new
    offsetscale2.l = ev.value;
    Redraw();
});

const offsetSliderForce1Params = {
    scale1: 0.4, //starts as double the size of the box's params
};
//make the plane size slider
tab.pages[0].addInput(offsetSliderForce1Params, 'scale1', {
    min: 0.2, //min = double the size of the box's params
    max: 1.2, //max = quadruple the size of the box's params
}).on('change', (ev) => { //on change, dispose old plane geometry and create new
    offsetscaleForce1.l = ev.value;
    Redraw();
});

const offsetSliderForce2Params = {
    scale2: 0.2, //starts as double the size of the box's params
};
//make the plane size slider
tab.pages[0].addInput(offsetSliderForce2Params, 'scale2', {
    min: 0.05, //min = double the size of the box's params
    max: 0.4, //max = quadruple the size of the box's params
}).on('change', (ev) => { //on change, dispose old plane geometry and create new
    offsetscaleForce2.l = ev.value;
    Redraw();
});


/************************* Left Panel third tab *************************/
// faces
const faceVisibilityCheckboxParams = {
    'face': false, //at first, box is unchecked so value is "false"
};

// faces - checkbox
const faceVisibilityCheckbox = tab.pages[1].addInput(faceVisibilityCheckboxParams, 'face').on('change', (ev) => { //on change, dispose old plane geometry and create new
    form_group_f.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = ev.value;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = ev.value;
        }
    });
});

const globalVisibilityCheckboxParams = {
    'global': false, //at first, box is unchecked so value is "false"
};
const globalVisibilityCheckbox = tab.pages[1].addInput(globalVisibilityCheckboxParams, 'global').on
('change', (ev) => { //on change, dispose old plane geometry and create new
    form_general_global.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = ev.value;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = ev.value;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = ev.value;
        }
    });
    force_general_global.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = ev.value;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = ev.value;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = ev.value;
        }
    });
    force_group_f.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = !ev.value;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = !ev.value;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = !ev.value;
        }
    });
    form_group_e.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = !ev.value;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = !ev.value;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = !ev.value;
        }
    });
});


/************************* Right Panel *************************/

const paneRight = new Tweakpane.Pane({
    container: document.getElementById('right_container'),
});

const heightParams = {
    height: 2,
};
const oSlider = paneRight.addInput(heightParams, 'height', {
    min: -2,
    max: 4,
})
oSlider.on('change', (ev) => { //on change, dispose old geometry and create new
    o1.l = ev.value;
    Redraw()
});

globalVisibilityCheckbox.on('change', () => { //on change, change the hidden and visibility values set
});

// *********************** form diagram initial data ***********************


var formBtPt1 = new THREE.Vector3(1.3, -1.3, -1.3);
var formBtPt2 = new THREE.Vector3(-1.776, -0.476, -1.3);
var formBtPt3 = new THREE.Vector3(0.476, 1.776, -1.3);

var Ctrl_pts = new Array(3);

var form_general

var form_group_v
var form_group_f
var form_group_e
var form_group_c
var form_general_global

var triP1 = new function () {
    this.z = 0.6;
}

var offsetscale = new function () {
    this.l = 0.4;
}
var offsetscale2 = new function () {
    this.l = 0.4;
}
var offsetscaleForce1 = new function () {
    this.l = 0.4;
}

var offsetscaleForce2 = new function () {
    this.l = 0.2;
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

var force_general_global

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

var subd = new function () {
    this.l = 1;
}


// *********************** redraw the form and force diagram when parameter is changing ****************
function Redraw() {

    //form groups
    scene.remove(form_group_v);
    scene.remove(form_group_f);
    scene.remove(form_group_e);
    scene.remove(form_group_c);
    scene.remove(form_general);
    scene.remove(form_general_global);


    form_group_v = new THREE.Group();
    form_group_f = new THREE.Group();
    form_group_e = new THREE.Group();
    form_group_c = new THREE.Group();
    form_general = new THREE.Group();

    form_general_global = new THREE.Group();

    //force groups
    scene2.remove(force_group_v);
    scene2.remove(force_group_f);
    scene2.remove(force_group_e);
    scene2.remove(force_group_c);
    scene2.remove(force_general);
    scene2.remove(force_group_f_trial);
    scene2.remove(force_group_e_trial);
    scene2.remove(force_general_trial);
    scene2.remove(force_general_global);

    scene2.remove(force_text);

    force_group_v = new THREE.Group();
    force_group_f = new THREE.Group();
    force_group_e = new THREE.Group();
    force_group_c = new THREE.Group();
    force_general = new THREE.Group();
    force_text = new THREE.Group();

    force_group_f_trial = new THREE.Group();
    force_group_e_trial = new THREE.Group();
    force_general_trial = new THREE.Group();
    force_general_global = new THREE.Group();


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

    var normal_apply = new THREE.MeshPhongMaterial({color: 0x009600});
    var normal_apply_outline = new THREE.MeshBasicMaterial({
        color: "white",
        transparent: false,
        side: THREE.BackSide
    });

    var arrow_apply = new THREE.MeshPhongMaterial({color: 0x009600});
    var arrow_apply_outline = new THREE.MeshBasicMaterial({
        color: "white",
        transparent: false,
        side: THREE.BackSide
    });

    var arrow_applyGlob = new THREE.MeshPhongMaterial({color: 0x009600});
    var arrow_apply_outlineGlob = new THREE.MeshBasicMaterial({
        color: "white",
        transparent: false,
        side: THREE.BackSide
    });

    var applyline_dash_glob = new THREE.LineDashedMaterial({
        color: 0x009600,//color
        dashSize: 0.05,
        gapSize: 0.03,
        linewidth: 1
    });

    // *********************** subdivision levels **************************
    // level 1 - only one apply loads
    // find the
    // apply loads locations o1, o2, o3

    var formPtO1a = create_offset_point(formBtPt1, formBtPt2, formBtPt3, offsetscale.l);
    var formPtO1 = new THREE.Vector3(formPtO1a.x, formPtO1a.y, formPtO1a.z + 2)
    var formPtO1b = new THREE.Vector3(formPtO1.x, formPtO1.y, formPtO1.z - 2.5);

    var formPtO2a = create_offset_point(formBtPt2, formBtPt1, formBtPt3, offsetscale.l);
    var formPtO2 = new THREE.Vector3(formPtO2a.x, formPtO2a.y, formPtO2a.z + 2)
    var formPtO2b = new THREE.Vector3(formPtO2.x, formPtO2.y, formPtO2.z - 2.5);

    var formPtO3a = create_offset_point(formBtPt3, formBtPt1, formBtPt2, offsetscale.l);
    var formPtO3 = new THREE.Vector3(formPtO3a.x, formPtO3a.y, formPtO3a.z + 2)
    var formPtO3b = new THREE.Vector3(formPtO3.x, formPtO3.y, formPtO3.z - 2.5);

    // add apply loads arrows - 1

    var apply_arrow1 = createCylinderArrowMesh(formPtO1, new THREE.Vector3(formPtO1.x, formPtO1.y, formPtO1.z - 0.4), arrow_apply, 0.02, 0.05, 0.56);
    form_general.add(apply_arrow1);
    var apply_arrow12 = createCylinderArrowMesh(new THREE.Vector3(formPtO1.x, formPtO1.y, formPtO1.z + 0.005), new THREE.Vector3(formPtO1.x, formPtO1.y, formPtO1.z - 0.425), arrow_apply_outline, 0.025, 0.06, 0.53);
    form_general.add(apply_arrow12);

    // add dash lines o1o1B, o2o2B
    var applyline_dash_form = new THREE.LineDashedMaterial({
        color: 0x009600,//color
        dashSize: 0.05,
        gapSize: 0.03,
        linewidth: 1
    });
    var applyline_dash_form_unhide = new THREE.LineDashedMaterial({
        color: 0x009600,//color
        dashSize: 0.05,
        gapSize: 0.03,
        linewidth: 1
    });


    var apply_o1o1B = [];
    apply_o1o1B.push(formPtO1);
    apply_o1o1B.push(formPtO1b);
    var apply_1_geo = new THREE.BufferGeometry().setFromPoints(apply_o1o1B);
    var applyline_o1B = new THREE.LineSegments(apply_1_geo, applyline_dash_form_unhide);
    applyline_o1B.computeLineDistances();//compute
    form_general.add(applyline_o1B);

    // add apply loads arrows - 2

    var apply_arrow2 = createCylinderArrowMesh(formPtO2, new THREE.Vector3(formPtO2.x, formPtO2.y, formPtO2.z - 0.4), arrow_apply, 0.02, 0.05, 0.56);
    form_general.add(apply_arrow2);
    var apply_arrow22 = createCylinderArrowMesh(new THREE.Vector3(formPtO2.x, formPtO2.y, formPtO2.z + 0.005), new THREE.Vector3(formPtO2.x, formPtO2.y, formPtO2.z - 0.425), arrow_apply_outline, 0.025, 0.06, 0.53);
    form_general.add(apply_arrow22);

    var apply_o2B = [];
    apply_o2B.push(formPtO2);
    apply_o2B.push(formPtO2b);
    var apply_2_geo = new THREE.BufferGeometry().setFromPoints(apply_o2B);
    var applyline_o2B = new THREE.LineSegments(apply_2_geo, applyline_dash_form_unhide);
    applyline_o2B.computeLineDistances();//compute
    form_general.add(applyline_o2B);

    // add apply loads arrows - 3

    var apply_arrow3 = createCylinderArrowMesh(formPtO3, new THREE.Vector3(formPtO3.x, formPtO3.y, formPtO3.z - 0.4), arrow_apply, 0.02, 0.05, 0.56);
    form_general.add(apply_arrow3);
    var apply_arrow32 = createCylinderArrowMesh(new THREE.Vector3(formPtO3.x, formPtO3.y, formPtO3.z + 0.005), new THREE.Vector3(formPtO3.x, formPtO3.y, formPtO3.z - 0.425), arrow_apply_outline, 0.025, 0.06, 0.53);
    form_general.add(apply_arrow32);

    var apply_o3B = [];
    apply_o3B.push(formPtO3);
    apply_o3B.push(formPtO3b);
    var apply_3_geo = new THREE.BufferGeometry().setFromPoints(apply_o3B);
    var applyline_o3B = new THREE.LineSegments(apply_3_geo, applyline_dash_form_unhide);
    applyline_o3B.computeLineDistances();//compute
    form_general.add(applyline_o3B);

    var TXapplyForce1 = createSpriteTextApply('f', "1", new THREE.Vector3(formPtO1.x, formPtO1.y, formPtO1.z + 0.1));
    form_general.add(TXapplyForce1);

    // var TXapplyForce2=createSpriteTextApply('f', "2", new THREE.Vector3(formPtO2.x, formPtO2.y, formPtO2.z+0.1));
    // form_general.add(TXapplyForce2);

    // var TXapplyForce3=createSpriteTextApply('f', "3", new THREE.Vector3(formPtO3.x, formPtO3.y, formPtO3.z+0.1));
    // form_general.add(TXapplyForce3);


    // green faces : o1 o1b point1
    var greenface_p1 = FormFace4ptGN(
        new THREE.Vector3(formBtPt1.x, formBtPt1.y, formPtO1b.z),
        new THREE.Vector3(formBtPt1.x, formBtPt1.y, formPtO1.z),
        formPtO1,
        formPtO1b
    )
    form_group_f.add(greenface_p1);

    var green_p1 = [];
    green_p1.push(new THREE.Vector3(formBtPt1.x, formBtPt1.y, formPtO1b.z));
    green_p1.push(new THREE.Vector3(formBtPt1.x, formBtPt1.y, formPtO1.z));
    var green_p1_geo = new THREE.BufferGeometry().setFromPoints(green_p1);
    var dashline_p1 = new THREE.LineSegments(green_p1_geo, applyline_dash_form);
    dashline_p1.computeLineDistances();//compute
    form_group_f.add(dashline_p1);

    // green faces : o2 o2b point2
    var greenface_p2 = FormFace4ptGN(
        new THREE.Vector3(formBtPt2.x, formBtPt2.y, formPtO2b.z),
        new THREE.Vector3(formBtPt2.x, formBtPt2.y, formPtO2.z),
        formPtO2,
        formPtO2b
    )
    form_group_f.add(greenface_p2);

    var green_p2 = [];
    green_p2.push(new THREE.Vector3(formBtPt2.x, formBtPt2.y, formPtO2b.z));
    green_p2.push(new THREE.Vector3(formBtPt2.x, formBtPt2.y, formPtO2.z));
    var green_p2_geo = new THREE.BufferGeometry().setFromPoints(green_p2);
    var dashline_p2 = new THREE.LineSegments(green_p2_geo, applyline_dash_form);
    dashline_p2.computeLineDistances();//compute
    form_group_f.add(dashline_p2);

    // green faces : o3 o3b point3
    var greenface_p3 = FormFace4ptGN(
        new THREE.Vector3(formBtPt3.x, formBtPt3.y, formPtO3b.z),
        new THREE.Vector3(formBtPt3.x, formBtPt3.y, formPtO3.z),
        formPtO3,
        formPtO3b
    )
    form_group_f.add(greenface_p3);

    var green_p3 = [];
    green_p3.push(new THREE.Vector3(formBtPt3.x, formBtPt3.y, formPtO3b.z));
    green_p3.push(new THREE.Vector3(formBtPt3.x, formBtPt3.y, formPtO3.z));
    var green_p3_geo = new THREE.BufferGeometry().setFromPoints(green_p3);
    var dashline_p3 = new THREE.LineSegments(green_p3_geo, applyline_dash_form);
    dashline_p3.computeLineDistances();//compute
    form_group_f.add(dashline_p3);

    // green faces : o1 o2
    // var greenface_p4 = FormFace4ptGN(
    //   formPtO1b,
    //   formPtO1,
    //   formPtO2,
    //   formPtO2b
    // )
    // form_group_f.add(greenface_p4);

    // var greenface_p5 = FormFace4ptGN(
    //   formPtO2b,
    //   formPtO2,
    //   formPtO3,
    //   formPtO3b
    // )
    // form_group_f.add(greenface_p5);

    // var greenface_p6 = FormFace4ptGN(
    //   formPtO1b,
    //   formPtO1,
    //   formPtO3,
    //   formPtO3b
    // )
    // form_group_f.add(greenface_p6);

    //form closing plane
    //plane mesh
    var form_closingplane = FormPlane3Pt(formBtPt2, formBtPt1, formBtPt3)
    form_general.add(form_closingplane);

    var formline_dash = new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.1,
        gapSize: 0.03,
        linewidth: 1

    });

    var form_linep1p2 = createdashline(formBtPt1, formBtPt2, formline_dash)
    var form_linep2p3 = createdashline(formBtPt2, formBtPt3, formline_dash)
    var form_linep1p3 = createdashline(formBtPt1, formBtPt3, formline_dash)

    form_general.add(form_linep1p2);
    form_general.add(form_linep2p3);
    form_general.add(form_linep1p3);

    //plane face normals
    var normal_material = new THREE.MeshPhongMaterial({color: "red"})
    var normal_outlinematerial = new THREE.MeshPhongMaterial({color: "white", side: THREE.BackSide})
    //normal 124
    var mid_p1p2p3 = new THREE.Vector3((formBtPt1.x + formBtPt2.x + formBtPt3.x) / 3, (formBtPt1.y + formBtPt2.y + formBtPt3.y) / 3, (formBtPt1.z + formBtPt2.z + formBtPt3.z) / 3)
    var vec_p1p2p3_temp = CalNormalVectorUpdated(formBtPt3, formBtPt2, formBtPt1, 1.2)
    var normal_p1p2p3 = new THREE.Vector3(mid_p1p2p3.x - 0.2 * vec_p1p2p3_temp.x, mid_p1p2p3.y - 0.2 * vec_p1p2p3_temp.y, mid_p1p2p3.z - 0.2 * vec_p1p2p3_temp.z)

    var form_normal_1 = createCylinderArrowMesh(mid_p1p2p3, normal_p1p2p3, normal_material, 0.015, 0.035, 0.55);
    var form_normal_1_outline = createCylinderArrowMesh(mid_p1p2p3, normal_p1p2p3, normal_outlinematerial, 0.018, 0.038, 0.54);

    form_general.add(form_normal_1);
    form_general.add(form_normal_1_outline);
    var TXformPlaneNormal = createSpriteTextNormal('n', "cp", "", new THREE.Vector3(normal_p1p2p3.x, normal_p1p2p3.y, normal_p1p2p3.z + 0.05));
    form_general.add(TXformPlaneNormal);

    // ***********************            force diagram            **************************
    var edgescale = 2; // size of the force diagram

    //PtA

    var forcePtA = new THREE.Vector3(1, 0.2, 0);
    var TXforcePtA = createSpriteText('A', "", new THREE.Vector3(forcePtA.x, forcePtA.y, forcePtA.z + 0.05));
    force_general.add(TXforcePtA);


    //PtB

    var forcePtBtemp = CalNormalVectorUpdated(formBtPt1, formPtO1, formPtO1b, edgescale);
    var forcePtB = new THREE.Vector3(forcePtA.x - forcePtBtemp.x, forcePtA.y - forcePtBtemp.y, forcePtA.z - forcePtBtemp.z);
    var TXforcePtB = createSpriteText('B', "", new THREE.Vector3(forcePtB.x, forcePtB.y, forcePtB.z + 0.05));
    force_general.add(TXforcePtB);

    //PtC

    var forcePtC1temp = CalNormalVectorUpdated(formBtPt2, formPtO2, formPtO2b, edgescale);
    var forcePtC1 = new THREE.Vector3(forcePtB.x - forcePtC1temp.x, forcePtB.y - forcePtC1temp.y, forcePtB.z - forcePtC1temp.z);

    var forcePtC2temp = CalNormalVectorUpdated(formBtPt3, formPtO3, formPtO3b, edgescale);
    var forcePtC2 = new THREE.Vector3(forcePtA.x - forcePtC2temp.x, forcePtA.y - forcePtC2temp.y, forcePtA.z - forcePtC2temp.z);

    var dirBC = new THREE.Vector3(); // create once an reuse it

    dirBC.subVectors(forcePtB, forcePtC1).normalize();

    var dirAC = new THREE.Vector3(); // create once an reuse it

    dirAC.subVectors(forcePtC2, forcePtA).normalize();
    var forcePtC = LinesSectPt(dirBC, forcePtB, dirAC, forcePtA);
    var TXforcePtC = createSpriteText('C', "", new THREE.Vector3(forcePtC.x, forcePtC.y, forcePtC.z + 0.05));
    force_general.add(TXforcePtC);

    //PtD

    var forcePtD1temp = CalNormalVectorUpdated(formPtO1, formPtO3, formPtO3b, edgescale);
    var forcePtD1 = new THREE.Vector3(forcePtA.x - forcePtD1temp.x, forcePtA.y - forcePtD1temp.y, forcePtA.z - forcePtD1temp.z);

    var forcePtD2temp = CalNormalVectorUpdated(formPtO2, formPtO1, formPtO1b, edgescale);
    var forcePtD2 = new THREE.Vector3(forcePtB.x - forcePtD2temp.x, forcePtB.y - forcePtD2temp.y, forcePtB.z - forcePtD2temp.z);

    var dirBD = new THREE.Vector3(); // create once an reuse it

    dirBD.subVectors(forcePtB, forcePtD2).normalize();

    var dirAD = new THREE.Vector3(); // create once an reuse it

    dirAD.subVectors(forcePtD1, forcePtA).normalize();
    var forcePtD = LinesSectPt(dirBD, forcePtB, dirAD, forcePtA);
    var TXforcePtD = createSpriteText('D', "", new THREE.Vector3(forcePtD.x, forcePtD.y, forcePtD.z + 0.05));
    force_general.add(TXforcePtD);

    //PtABmid

    var forcePtABmid = new THREE.Vector3((forcePtA.x + forcePtB.x) / 2, (forcePtA.y + forcePtB.y) / 2, (forcePtA.z + forcePtB.z) / 2)
    var forcePtAB = new THREE.Vector3(
        forcePtABmid.x + offsetscaleForce1.l * subVecUpdated(forcePtABmid, forcePtD).x,
        forcePtABmid.y + offsetscaleForce1.l * subVecUpdated(forcePtABmid, forcePtD).y,
        forcePtABmid.z + offsetscaleForce1.l * subVecUpdated(forcePtABmid, forcePtD).z
    )

    //PtBCmid

    var forcePtBCmid = new THREE.Vector3((forcePtC.x + forcePtB.x) / 2, (forcePtC.y + forcePtB.y) / 2, (forcePtC.z + forcePtB.z) / 2)
    var forcePtBC = new THREE.Vector3(
        forcePtBCmid.x + offsetscaleForce1.l * subVecUpdated(forcePtBCmid, forcePtD).x,
        forcePtBCmid.y + offsetscaleForce1.l * subVecUpdated(forcePtBCmid, forcePtD).y,
        forcePtBCmid.z + offsetscaleForce1.l * subVecUpdated(forcePtBCmid, forcePtD).z
    )

    //PtACmid

    var forcePtACmid = new THREE.Vector3((forcePtC.x + forcePtA.x) / 2, (forcePtC.y + forcePtA.y) / 2, (forcePtC.z + forcePtA.z) / 2)
    var forcePtAC = new THREE.Vector3(
        forcePtACmid.x + offsetscaleForce1.l * subVecUpdated(forcePtACmid, forcePtD).x,
        forcePtACmid.y + offsetscaleForce1.l * subVecUpdated(forcePtACmid, forcePtD).y,
        forcePtACmid.z + offsetscaleForce1.l * subVecUpdated(forcePtACmid, forcePtD).z
    )

    //PtA1

    var forcePtAmid = create_offset_point(forcePtA, forcePtB, forcePtC, offsetscaleForce2.l)
    var forcePtBmid = create_offset_point(forcePtB, forcePtA, forcePtC, offsetscaleForce2.l)
    var forcePtCmid = create_offset_point(forcePtC, forcePtB, forcePtA, offsetscaleForce2.l)


    // face ABC
    var forceFaceABC = ForceFace3pt(forcePtA, forcePtB, forcePtC, 0x014F06)
    force_group_f.add(forceFaceABC)
    var forceFaceABC2 = ForceFace3pt(forcePtA, forcePtB, forcePtC, 0x014F06)
    force_general_global.add(forceFaceABC2)

    // var ACDarrow = createCircleFaceArrow(face_center(forcePtA,forcePtC,forcePtD), 0.15, cross(subVecUpdated(forcePtC, forcePtA),subVecUpdated(forcePtA, forcePtD)))
    // force_general.add(ACDarrow);
    // var BCDarrow = createCircleFaceArrow(face_center(forcePtB,forcePtC,forcePtD), 0.15, cross(subVecUpdated(forcePtB, forcePtC),subVecUpdated(forcePtC, forcePtD)))
    // force_general.add(BCDarrow);
    // var ABDarrow = createCircleFaceArrow(face_center(forcePtA,forcePtB,forcePtD), 0.15, cross(subVecUpdated(forcePtA, forcePtB),subVecUpdated(forcePtB, forcePtD)))
    // force_general.add(ABDarrow);


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

    // const forceEdgeBD = createCylinderMesh(forcePtB,forcePtD,forceEdgeMaterial,edgeSize,edgeSize);
    // force_group_e.add(forceEdgeBD)

    // const forceEdgeAD = createCylinderMesh(forcePtA,forcePtD,forceEdgeMaterial,edgeSize,edgeSize);
    // force_group_e.add(forceEdgeAD)

    // const forceEdgeCD = createCylinderMesh(forcePtC,forcePtD,forceEdgeMaterial,edgeSize,edgeSize);
    // force_group_e.add(forceEdgeCD)

    const forceEdgeAAB = createCylinderMesh(forcePtA, forcePtAB, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeAAB)

    const forceEdgeBAB = createCylinderMesh(forcePtB, forcePtAB, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeBAB)

    const forceEdgeBBC = createCylinderMesh(forcePtB, forcePtBC, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeBBC)

    const forceEdgeCBC = createCylinderMesh(forcePtC, forcePtBC, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeCBC)

    const forceEdgeAAC = createCylinderMesh(forcePtA, forcePtAC, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeAAC)

    const forceEdgeCAC = createCylinderMesh(forcePtC, forcePtAC, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeCAC)

    const forceEdgeAAmid = createCylinderMesh(forcePtA, forcePtAmid, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeAAmid)

    const forceEdgeBBmid = createCylinderMesh(forcePtB, forcePtBmid, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeBBmid)

    const forceEdgeCCmid = createCylinderMesh(forcePtC, forcePtCmid, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeCCmid)

    const forceEdgeAmidBmid = createCylinderMesh(forcePtAmid, forcePtBmid, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeAmidBmid)

    const forceEdgeBmidCmid = createCylinderMesh(forcePtBmid, forcePtCmid, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeBmidCmid)

    const forceEdgeAmidCmid = createCylinderMesh(forcePtAmid, forcePtCmid, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeAmidCmid)

    const forceEdgeAmidAB = createCylinderMesh(forcePtAmid, forcePtAB, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeAmidAB)

    const forceEdgeBmidAB = createCylinderMesh(forcePtBmid, forcePtAB, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeBmidAB)

    const forceEdgeAmidAC = createCylinderMesh(forcePtAmid, forcePtAC, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeAmidAC)

    const forceEdgeCmidAC = createCylinderMesh(forcePtCmid, forcePtAC, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeCmidAC)

    const forceEdgeBmidBC = createCylinderMesh(forcePtBmid, forcePtBC, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeBmidBC)

    const forceEdgeCmidBC = createCylinderMesh(forcePtCmid, forcePtBC, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeCmidBC)
    // *********************** force trial point O **************************

    var TrialP_O = new THREE.Vector3(fo.x, fo.y, fo.z);

    // const TrialP_0Sp = addVertice(0.01, "sp1", TrialP_O);
    // const TrialP_0Sp_out = addVerticeOut(0.01, TrialP_0Sp.position, 1.55)
    // force_general_trial.add(TrialP_0Sp);
    // force_general_trial.add(TrialP_0Sp_out);

    // const TrialFaces = ForceTrialFace3Pt(forcePtA,forcePtB,forcePtD, TrialP_O)
    // force_group_f_trial.add(TrialFaces)
    // const TrialFaces2 = ForceTrialFace3Pt(forcePtB,forcePtC,forcePtD, TrialP_O)
    // force_group_f_trial.add(TrialFaces2)
    // const TrialFaces3 = ForceTrialFace3Pt(forcePtA,forcePtC,forcePtD, TrialP_O)
    // force_group_f_trial.add(TrialFaces3)

    // var TXformNodeTrialO = createSpriteTextPrime ('O', "'", new THREE.Vector3(TrialP_O.x, TrialP_O.y, TrialP_O.z+0.1));
    // force_general_trial.add(TXformNodeTrialO);

    // ***********************           trial form                **************************
    var DragPointMat = new THREE.MeshPhongMaterial({color: 0x696969, transparent: true, opacity: 0.8});

    var trial_P1 = new THREE.Vector3(formBtPt1.x, formBtPt1.y, triP1.z)

    var trial_o1 = create_trial_intec(trial_P1, forcePtA, TrialP_O, forcePtB, formPtO1, formPtO1b);
    var trial_o2 = create_trial_intec(trial_o1, forcePtD, TrialP_O, forcePtB, formPtO2, formPtO2b);
    var trial_P2 = create_trial_intec(trial_o2, forcePtC, TrialP_O, forcePtB, formBtPt2, new THREE.Vector3(formBtPt2.x, formBtPt2.y, formBtPt2.z - 1));
    var trial_o3 = create_trial_intec(trial_o1, forcePtD, TrialP_O, forcePtA, formPtO3, formPtO3b);
    var trial_P3 = create_trial_intec(trial_o3, forcePtA, TrialP_O, forcePtC, formBtPt3, new THREE.Vector3(formBtPt3.x, formBtPt3.y, formBtPt3.z - 1));

    createCylinderMesh(trial_o1, trial_P1, DragPointMat, 0.02, 0.02);
    createCylinderMesh(trial_o2, trial_P2, DragPointMat, 0.02, 0.02);
    createCylinderMesh(trial_P3, trial_o3, DragPointMat, 0.02, 0.02);
    createCylinderMesh(trial_o1, trial_o2, DragPointMat, 0.02, 0.02);
    createCylinderMesh(trial_o1, trial_o3, DragPointMat, 0.02, 0.02);
    createCylinderMesh(trial_o3, trial_o2, DragPointMat, 0.02, 0.02);

    //trial form closing plane

    var trialline_dash = new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.1,
        gapSize: 0.03,
        linewidth: 1

    });

    createdashline(trial_P1, trial_P2, trialline_dash)
    createdashline(trial_P2, trial_P3, trialline_dash)
    createdashline(trial_P1, trial_P3, trialline_dash)

    //trial plane face normals
    var trialmid_p1p2p3 = new THREE.Vector3((trial_P1.x + trial_P2.x + trial_P3.x) / 3, (trial_P1.y + trial_P2.y + trial_P3.y) / 3, (trial_P1.z + trial_P2.z + trial_P3.z) / 3)
    var vec_p1p2p3_temp = CalNormalVectorUpdated(trial_P3, trial_P2, trial_P1, 1.2)
    var trialnormal_p1p2p3 = new THREE.Vector3(trialmid_p1p2p3.x - 0.2 * vec_p1p2p3_temp.x, trialmid_p1p2p3.y - 0.2 * vec_p1p2p3_temp.y, trialmid_p1p2p3.z - 0.2 * vec_p1p2p3_temp.z)

    var trial_normal_material = new THREE.MeshPhongMaterial({color: "red"})
    var trial_normal_outlinematerial = new THREE.MeshPhongMaterial({color: "white", side: THREE.BackSide})
    var force_normal_material = new THREE.MeshPhongMaterial({color: "red"})

    createCylinderArrowMesh(trialmid_p1p2p3, trialnormal_p1p2p3, trial_normal_material, 0.015, 0.035, 0.55);
    createCylinderArrowMesh(trialmid_p1p2p3, trialnormal_p1p2p3, trial_normal_outlinematerial, 0.018, 0.038, 0.54);

    // ***********************          find trial force point x1              **************************

    //location of x1
    //find x1
    var ForceX1_vec = CalNormalVectorUpdated(trial_P1, trial_P2, trial_P3, 0.5);
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
    // force_general_trial.add(applylineox1);

    var x1_closeP1 = addVectorAlongDir(TrialP_O, ForceX1, -1);
    var x1_closeP2 = addVectorAlongDir(TrialP_O, ForceX1, -0.8);

    createCylinderArrowMesh(x1_closeP1, x1_closeP2, force_normal_material, 0.012, 0.025, 0.55);

    // force_general_trial.add(x1_arrow);
    var materialpointx = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});

    var spforcePointx = new THREE.SphereGeometry(0.01);
    var new_forcePointx1 = new THREE.Mesh(spforcePointx, materialpointx);

    new_forcePointx1.position.copy(ForceX1);

    var outlineMaterialx = new THREE.MeshBasicMaterial({color: "red", transparent: false, side: THREE.BackSide});
    var outlineMeshnewx1 = new THREE.Mesh(spforcePointx, outlineMaterialx);
    outlineMeshnewx1.position.copy(ForceX1);
    outlineMeshnewx1.scale.multiplyScalar(1.55);

    force_general.add(new_forcePointx1);
    force_general.add(outlineMeshnewx1);
    //find constrain point o1
    var ForceO1_temp = CalNormalVectorUpdated(formBtPt1, formBtPt2, formBtPt3, 0.5);
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
    createCylinderArrowMesh(ForceO1_closeP1, ForceO1_closeP2, force_normal_material, 0.012, 0.025, 0.55);

    // force_general.add(ForceO1_arrow);

    if (ForceO1.z < 0) {
        var TXforcePtO = createSpriteText('O', "", new THREE.Vector3(ForceO1.x, ForceO1.y, ForceO1.z - 0.2));
        force_general.add(TXforcePtO);
    } else {
        var TXforcePtO = createSpriteText('O', "", new THREE.Vector3(ForceO1.x, ForceO1.y, ForceO1.z + 0.1));
        force_general.add(TXforcePtO);
    }


    // ***********************          find force edges        **************************

    const forceEdgeAO1 = createCylinderMesh(forcePtA, ForceO1, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeAO1);

    const forceEdgeBO1 = createCylinderMesh(forcePtB, ForceO1, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeBO1);

    const forceEdgeCO1 = createCylinderMesh(forcePtC, ForceO1, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeCO1);


    const forceEdgeABO1 = createCylinderMesh(forcePtAB, ForceO1, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeABO1);

    const forceEdgeACO1 = createCylinderMesh(forcePtAC, ForceO1, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeACO1);

    const forceEdgeBCO1 = createCylinderMesh(forcePtBC, ForceO1, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeBCO1);

    const forceEdgeAmidO1 = createCylinderMesh(forcePtAmid, ForceO1, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeAmidO1);

    const forceEdgeBmidO1 = createCylinderMesh(forcePtBmid, ForceO1, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeBmidO1);

    const forceEdgeCmidO1 = createCylinderMesh(forcePtCmid, ForceO1, forceEdgeMaterial, edgeSize, edgeSize);
    force_group_e.add(forceEdgeCmidO1);

    drawForceNormals(forcePtA, forcePtB, forcePtAB, normal_apply, normal_apply_outline, "f")
    // var forceFaceNormal2 = drawForceNormals (forcePtA,forcePtD,forcePtC,normal_apply,normal_apply_outline,"3")
    // var forceFaceNormal3 = drawForceNormals (forcePtB,forcePtD,forcePtC,normal_apply,normal_apply_outline,"2")

    function drawForceNormals(forcePtA, forcePtB, forcePtC, normal_apply, normal_apply_outline, number) {
        var normal_apply = new THREE.MeshPhongMaterial({color: 0x009600});
        var normal_apply_outline = new THREE.MeshBasicMaterial({
            color: "white",
            transparent: false,
            side: THREE.BackSide
        });

        var forceABCcenter = face_center(forcePtA, forcePtB, forcePtC)
        if (ForceO1.z < 0) {
            var normal_arrow1 = createCylinderArrowMesh(
                new THREE.Vector3(forceABCcenter.x, forceABCcenter.y, forceABCcenter.z + 0.4),
                forceABCcenter,
                normal_apply, 0.02, 0.05, 0.56
            );

            force_general.add(normal_arrow1);
            var normal_arrow12 = createCylinderArrowMesh(
                new THREE.Vector3(forceABCcenter.x, forceABCcenter.y, forceABCcenter.z + 0.405),
                new THREE.Vector3(forceABCcenter.x, forceABCcenter.y, forceABCcenter.z - 0.025),
                normal_apply_outline, 0.025, 0.06, 0.53
            );

            force_general.add(normal_arrow12);
            //add text
            var TXapplyNormal = createSpriteTextApply('n', number, new THREE.Vector3(forceABCcenter.x, forceABCcenter.y, forceABCcenter.z + 0.4));
            force_general.add(TXapplyNormal);
        } else {
            var normal_arrow1 = createCylinderArrowMesh(
                forceABCcenter,
                new THREE.Vector3(forceABCcenter.x, forceABCcenter.y, forceABCcenter.z - 0.4),
                normal_apply, 0.02, 0.05, 0.56
            );

            force_general.add(normal_arrow1);
            var normal_arrow12 = createCylinderArrowMesh(
                new THREE.Vector3(forceABCcenter.x, forceABCcenter.y, forceABCcenter.z + 0.025),
                new THREE.Vector3(forceABCcenter.x, forceABCcenter.y, forceABCcenter.z - 0.430),
                normal_apply_outline, 0.025, 0.06, 0.53
            );

            force_general.add(normal_arrow12);
            //add text
            var TXapplyNormal = createSpriteTextApply('n', number, new THREE.Vector3(forceABCcenter.x, forceABCcenter.y, forceABCcenter.z - 0.535));
            force_general.add(TXapplyNormal);

        }
    }

    // ***********************          find form edges        **************************

    var formPtO1new = create_trial_intec(formBtPt1, forcePtA, ForceO1, forcePtB, formPtO1, formPtO1b);
    var formPtO2new = create_trial_intec(formBtPt2, forcePtB, ForceO1, forcePtC, formPtO2, formPtO2b);
    var formPtO3new = create_trial_intec(formBtPt3, forcePtC, ForceO1, forcePtA, formPtO3, formPtO3b);

    //formPt O1 - step1
    if (ForceO1.z < 0) {
        var formPtAAB = new THREE.Vector3(
            formPtO1new.x - offsetscale2.l * (CalNormalVectorUpdated(ForceO1, forcePtAB, forcePtA, 1)).x,
            formPtO1new.y - offsetscale2.l * (CalNormalVectorUpdated(ForceO1, forcePtAB, forcePtA, 1)).y,
            formPtO1new.z - offsetscale2.l * (CalNormalVectorUpdated(ForceO1, forcePtAB, forcePtA, 1)).z
        )
    } else {
        var formPtAAB = new THREE.Vector3(
            formPtO1new.x + offsetscale2.l * (CalNormalVectorUpdated(ForceO1, forcePtAB, forcePtA, 1)).x,
            formPtO1new.y + offsetscale2.l * (CalNormalVectorUpdated(ForceO1, forcePtAB, forcePtA, 1)).y,
            formPtO1new.z + offsetscale2.l * (CalNormalVectorUpdated(ForceO1, forcePtAB, forcePtA, 1)).z
        )
    }
    addVerticeWOut(0.04, formPtAAB, form_group_v)

    var greenface_AAB = FormFace4ptGN(
        new THREE.Vector3(formPtAAB.x, formPtAAB.y, formPtO1b.z),
        new THREE.Vector3(formPtAAB.x, formPtAAB.y, formPtO1.z),
        formPtO1,
        formPtO1b
    )
    form_group_f.add(greenface_AAB);

    form_general.add(addApplyarrow(
        new THREE.Vector3(formPtAAB.x, formPtAAB.y, formPtO1.z),
        new THREE.Vector3(formPtAAB.x, formPtAAB.y, formPtO1b.z),
    ))

    // ***********


    if (ForceO1.z < 0) {
        var formPtBAB = new THREE.Vector3(
            formPtO1new.x - offsetscale2.l * (CalNormalVectorUpdated(forcePtB, forcePtAB, ForceO1, 1)).x,
            formPtO1new.y - offsetscale2.l * (CalNormalVectorUpdated(forcePtB, forcePtAB, ForceO1, 1)).y,
            formPtO1new.z - offsetscale2.l * (CalNormalVectorUpdated(forcePtB, forcePtAB, ForceO1, 1)).z
        )
    } else {
        var formPtBAB = new THREE.Vector3(
            formPtO1new.x + offsetscale2.l * (CalNormalVectorUpdated(forcePtB, forcePtAB, ForceO1, 1)).x,
            formPtO1new.y + offsetscale2.l * (CalNormalVectorUpdated(forcePtB, forcePtAB, ForceO1, 1)).y,
            formPtO1new.z + offsetscale2.l * (CalNormalVectorUpdated(forcePtB, forcePtAB, ForceO1, 1)).z
        )
    }
    addVerticeWOut(0.04, formPtBAB, form_group_v)

    var greenface_BAB = FormFace4ptGN(
        new THREE.Vector3(formPtBAB.x, formPtBAB.y, formPtO1b.z),
        new THREE.Vector3(formPtBAB.x, formPtBAB.y, formPtO1.z),
        formPtO1,
        formPtO1b
    )
    form_group_f.add(greenface_BAB);

    form_general.add(addApplyarrow(
        new THREE.Vector3(formPtBAB.x, formPtBAB.y, formPtO1.z),
        new THREE.Vector3(formPtBAB.x, formPtBAB.y, formPtO1b.z),
    ))

    // ***********


    //formPt O2 - step1
    if (ForceO1.z < 0) {
        var formPtBBC = new THREE.Vector3(
            formPtO2new.x - offsetscale2.l * (CalNormalVectorUpdated(ForceO1, forcePtBC, forcePtB, 1)).x,
            formPtO2new.y - offsetscale2.l * (CalNormalVectorUpdated(ForceO1, forcePtBC, forcePtB, 1)).y,
            formPtO2new.z - offsetscale2.l * (CalNormalVectorUpdated(ForceO1, forcePtBC, forcePtB, 1)).z
        )
    } else {
        var formPtBBC = new THREE.Vector3(
            formPtO2new.x + offsetscale2.l * (CalNormalVectorUpdated(ForceO1, forcePtBC, forcePtB, 1)).x,
            formPtO2new.y + offsetscale2.l * (CalNormalVectorUpdated(ForceO1, forcePtBC, forcePtB, 1)).y,
            formPtO2new.z + offsetscale2.l * (CalNormalVectorUpdated(ForceO1, forcePtBC, forcePtB, 1)).z
        )
    }
    addVerticeWOut(0.04, formPtBBC, form_group_v)

    var greenface_BBC = FormFace4ptGN(
        new THREE.Vector3(formPtBBC.x, formPtBBC.y, formPtO2b.z),
        new THREE.Vector3(formPtBBC.x, formPtBBC.y, formPtO2.z),
        formPtO2,
        formPtO2b
    )
    form_group_f.add(greenface_BBC);

    form_general.add(addApplyarrow(
        new THREE.Vector3(formPtBBC.x, formPtBBC.y, formPtO2.z),
        new THREE.Vector3(formPtBBC.x, formPtBBC.y, formPtO2b.z),
    ))

    // ***********


    if (ForceO1.z < 0) {
        var formPtCBC = new THREE.Vector3(
            formPtO2new.x - offsetscale2.l * (CalNormalVectorUpdated(forcePtC, forcePtBC, ForceO1, 1)).x,
            formPtO2new.y - offsetscale2.l * (CalNormalVectorUpdated(forcePtC, forcePtBC, ForceO1, 1)).y,
            formPtO2new.z - offsetscale2.l * (CalNormalVectorUpdated(forcePtC, forcePtBC, ForceO1, 1)).z
        )
    } else {
        var formPtCBC = new THREE.Vector3(
            formPtO2new.x + offsetscale2.l * (CalNormalVectorUpdated(forcePtC, forcePtBC, ForceO1, 1)).x,
            formPtO2new.y + offsetscale2.l * (CalNormalVectorUpdated(forcePtC, forcePtBC, ForceO1, 1)).y,
            formPtO2new.z + offsetscale2.l * (CalNormalVectorUpdated(forcePtC, forcePtBC, ForceO1, 1)).z
        )
    }
    addVerticeWOut(0.04, formPtCBC, form_group_v)

    var greenface_CBC = FormFace4ptGN(
        new THREE.Vector3(formPtCBC.x, formPtCBC.y, formPtO2b.z),
        new THREE.Vector3(formPtCBC.x, formPtCBC.y, formPtO2.z),
        formPtO2,
        formPtO2b
    )
    form_group_f.add(greenface_CBC);

    form_general.add(addApplyarrow(
        new THREE.Vector3(formPtCBC.x, formPtCBC.y, formPtO2.z),
        new THREE.Vector3(formPtCBC.x, formPtCBC.y, formPtO2b.z),
    ))

    // ***********

    //formPt O3 - step1
    if (ForceO1.z < 0) {
        var formPtCAC = new THREE.Vector3(
            formPtO3new.x - offsetscale2.l * (CalNormalVectorUpdated(ForceO1, forcePtAC, forcePtC, 1)).x,
            formPtO3new.y - offsetscale2.l * (CalNormalVectorUpdated(ForceO1, forcePtAC, forcePtC, 1)).y,
            formPtO3new.z - offsetscale2.l * (CalNormalVectorUpdated(ForceO1, forcePtAC, forcePtC, 1)).z
        )
    } else {
        var formPtCAC = new THREE.Vector3(
            formPtO3new.x + offsetscale2.l * (CalNormalVectorUpdated(ForceO1, forcePtAC, forcePtC, 1)).x,
            formPtO3new.y + offsetscale2.l * (CalNormalVectorUpdated(ForceO1, forcePtAC, forcePtC, 1)).y,
            formPtO3new.z + offsetscale2.l * (CalNormalVectorUpdated(ForceO1, forcePtAC, forcePtC, 1)).z
        )
    }
    addVerticeWOut(0.04, formPtCAC, form_group_v)

    var greenface_CAC = FormFace4ptGN(
        new THREE.Vector3(formPtCAC.x, formPtCAC.y, formPtO3b.z),
        new THREE.Vector3(formPtCAC.x, formPtCAC.y, formPtO3.z),
        formPtO3,
        formPtO3b
    )
    form_group_f.add(greenface_CAC);

    form_general.add(addApplyarrow(
        new THREE.Vector3(formPtCAC.x, formPtCAC.y, formPtO3.z),
        new THREE.Vector3(formPtCAC.x, formPtCAC.y, formPtO3b.z),
    ))

    // ***********


    if (ForceO1.z < 0) {
        var formPtAAC = new THREE.Vector3(
            formPtO3new.x - offsetscale2.l * (CalNormalVectorUpdated(forcePtA, forcePtAC, ForceO1, 1)).x,
            formPtO3new.y - offsetscale2.l * (CalNormalVectorUpdated(forcePtA, forcePtAC, ForceO1, 1)).y,
            formPtO3new.z - offsetscale2.l * (CalNormalVectorUpdated(forcePtA, forcePtAC, ForceO1, 1)).z
        )
    } else {
        var formPtAAC = new THREE.Vector3(
            formPtO3new.x + offsetscale2.l * (CalNormalVectorUpdated(forcePtA, forcePtAC, ForceO1, 1)).x,
            formPtO3new.y + offsetscale2.l * (CalNormalVectorUpdated(forcePtA, forcePtAC, ForceO1, 1)).y,
            formPtO3new.z + offsetscale2.l * (CalNormalVectorUpdated(forcePtA, forcePtAC, ForceO1, 1)).z
        )
    }
    addVerticeWOut(0.04, formPtAAC, form_group_v)

    var greenface_AAC = FormFace4ptGN(
        new THREE.Vector3(formPtAAC.x, formPtAAC.y, formPtO3b.z),
        new THREE.Vector3(formPtAAC.x, formPtAAC.y, formPtO3.z),
        formPtO3,
        formPtO3b
    )
    form_group_f.add(greenface_AAC);

    form_general.add(addApplyarrow(
        new THREE.Vector3(formPtAAC.x, formPtAAC.y, formPtO3.z),
        new THREE.Vector3(formPtAAC.x, formPtAAC.y, formPtO3b.z),
    ))

    // ***********


    //intersect pt - AAB & BAB

    var formPtAmidAB = findINSecPt(forcePtAB, forcePtAmid, ForceO1, ForceO1, forcePtAB, forcePtBmid, edgescale, formPtAAB, formPtBAB)
    addVerticeWOut(0.04, formPtAmidAB, form_group_v)

    var greenface_AmidAB = FormFace4ptGN(
        new THREE.Vector3(formPtAmidAB.x, formPtAmidAB.y, formPtO1b.z),
        new THREE.Vector3(formPtAmidAB.x, formPtAmidAB.y, formPtO1.z),
        new THREE.Vector3(formPtAAB.x, formPtAAB.y, formPtO1.z),
        new THREE.Vector3(formPtAAB.x, formPtAAB.y, formPtO1b.z),
    )
    form_group_f.add(greenface_AmidAB);

    form_general.add(addApplyarrow(
        new THREE.Vector3(formPtAmidAB.x, formPtAmidAB.y, formPtO1.z),
        new THREE.Vector3(formPtAmidAB.x, formPtAmidAB.y, formPtO1b.z),
    ))

    var greenface_AmidAB2 = FormFace4ptGN(
        new THREE.Vector3(formPtAmidAB.x, formPtAmidAB.y, formPtO1b.z),
        new THREE.Vector3(formPtAmidAB.x, formPtAmidAB.y, formPtO1.z),
        new THREE.Vector3(formPtBAB.x, formPtBAB.y, formPtO1.z),
        new THREE.Vector3(formPtBAB.x, formPtBAB.y, formPtO1b.z),
    )
    form_group_f.add(greenface_AmidAB2);


    // ***********


    //intersect pt - AAC & CAC

    var formPtCmidAC = findINSecPt(forcePtAC, forcePtCmid, ForceO1, ForceO1, forcePtAmid, forcePtAC, edgescale, formPtCAC, formPtAAC)
    addVerticeWOut(0.04, formPtCmidAC, form_group_v)

    var greenface_CmidAC = FormFace4ptGN(
        new THREE.Vector3(formPtCmidAC.x, formPtCmidAC.y, formPtO3b.z),
        new THREE.Vector3(formPtCmidAC.x, formPtCmidAC.y, formPtO3.z),
        new THREE.Vector3(formPtAAC.x, formPtAAC.y, formPtO3.z),
        new THREE.Vector3(formPtAAC.x, formPtAAC.y, formPtO3b.z),
    )
    form_group_f.add(greenface_CmidAC);

    form_general.add(addApplyarrow(
        new THREE.Vector3(formPtCmidAC.x, formPtCmidAC.y, formPtO3.z),
        new THREE.Vector3(formPtCmidAC.x, formPtCmidAC.y, formPtO3b.z),
    ))

    var greenface_CmidAC2 = FormFace4ptGN(
        new THREE.Vector3(formPtCmidAC.x, formPtCmidAC.y, formPtO3b.z),
        new THREE.Vector3(formPtCmidAC.x, formPtCmidAC.y, formPtO3.z),
        new THREE.Vector3(formPtCAC.x, formPtCAC.y, formPtO3.z),
        new THREE.Vector3(formPtCAC.x, formPtCAC.y, formPtO3b.z),
    )
    form_group_f.add(greenface_CmidAC2);


    // ***********

    //intersect pt - BBC & CBC

    var formPtCmidBC = findINSecPt(forcePtBC, forcePtBmid, ForceO1, ForceO1, forcePtCmid, forcePtBC, edgescale, formPtBBC, formPtCBC)
    addVerticeWOut(0.04, formPtCmidBC, form_group_v)

    var greenface_CmidBC = FormFace4ptGN(
        new THREE.Vector3(formPtCmidBC.x, formPtCmidBC.y, formPtO2b.z),
        new THREE.Vector3(formPtCmidBC.x, formPtCmidBC.y, formPtO2.z),
        new THREE.Vector3(formPtCBC.x, formPtCBC.y, formPtO2.z),
        new THREE.Vector3(formPtCBC.x, formPtCBC.y, formPtO2b.z),
    )
    form_group_f.add(greenface_CmidBC);

    form_general.add(addApplyarrow(
        new THREE.Vector3(formPtCmidBC.x, formPtCmidBC.y, formPtO2.z),
        new THREE.Vector3(formPtCmidBC.x, formPtCmidBC.y, formPtO2b.z),
    ))

    var greenface_CmidBC2 = FormFace4ptGN(
        new THREE.Vector3(formPtCmidBC.x, formPtCmidBC.y, formPtO2b.z),
        new THREE.Vector3(formPtCmidBC.x, formPtCmidBC.y, formPtO2.z),
        new THREE.Vector3(formPtBBC.x, formPtBBC.y, formPtO2.z),
        new THREE.Vector3(formPtBBC.x, formPtBBC.y, formPtO2b.z),
    )
    form_group_f.add(greenface_CmidBC2);

    // ***********

    var formPtMid = findINSecPt(forcePtCmid, forcePtBmid, ForceO1, ForceO1, forcePtBmid, forcePtAmid, edgescale, formPtCmidBC, formPtAmidAB)
    addVerticeWOut(0.04, formPtMid, form_group_v)

    var greenface_PtMid = FormFace4ptGN(
        new THREE.Vector3(formPtMid.x, formPtMid.y, formPtO1b.z),
        new THREE.Vector3(formPtMid.x, formPtMid.y, formPtO1.z),
        new THREE.Vector3(formPtCmidBC.x, formPtCmidBC.y, formPtO1.z),
        new THREE.Vector3(formPtCmidBC.x, formPtCmidBC.y, formPtO1b.z),
    )
    form_group_f.add(greenface_PtMid);

    form_general.add(addApplyarrow(
        new THREE.Vector3(formPtMid.x, formPtMid.y, formPtO2.z),
        new THREE.Vector3(formPtMid.x, formPtMid.y, formPtO2b.z),
    ))

    var greenface_PtMid2 = FormFace4ptGN(
        new THREE.Vector3(formPtMid.x, formPtMid.y, formPtO1b.z),
        new THREE.Vector3(formPtMid.x, formPtMid.y, formPtO1.z),
        new THREE.Vector3(formPtCmidAC.x, formPtCmidAC.y, formPtO1.z),
        new THREE.Vector3(formPtCmidAC.x, formPtCmidAC.y, formPtO1b.z),
    )
    form_group_f.add(greenface_PtMid2);

    var greenface_PtMid3 = FormFace4ptGN(
        new THREE.Vector3(formPtMid.x, formPtMid.y, formPtO1b.z),
        new THREE.Vector3(formPtMid.x, formPtMid.y, formPtO1.z),
        new THREE.Vector3(formPtAmidAB.x, formPtAmidAB.y, formPtO1.z),
        new THREE.Vector3(formPtAmidAB.x, formPtAmidAB.y, formPtO1b.z),
    )
    form_group_f.add(greenface_PtMid3);


    var greenface_ABAC = FormFace4ptGN(
        new THREE.Vector3(formPtAAB.x, formPtAAB.y, formPtO1b.z),
        new THREE.Vector3(formPtAAB.x, formPtAAB.y, formPtO1.z),
        new THREE.Vector3(formPtAAC.x, formPtAAC.y, formPtO1.z),
        new THREE.Vector3(formPtAAC.x, formPtAAC.y, formPtO1b.z),
    )
    form_group_f.add(greenface_ABAC);

    var greenface_BCCB = FormFace4ptGN(
        new THREE.Vector3(formPtBBC.x, formPtBBC.y, formPtO1b.z),
        new THREE.Vector3(formPtBBC.x, formPtBBC.y, formPtO1.z),
        new THREE.Vector3(formPtBAB.x, formPtBAB.y, formPtO1.z),
        new THREE.Vector3(formPtBAB.x, formPtBAB.y, formPtO1b.z),
    )
    form_group_f.add(greenface_BCCB);


    var greenface_ACCB = FormFace4ptGN(
        new THREE.Vector3(formPtCAC.x, formPtCAC.y, formPtO1b.z),
        new THREE.Vector3(formPtCAC.x, formPtCAC.y, formPtO1.z),
        new THREE.Vector3(formPtCBC.x, formPtCBC.y, formPtO1.z),
        new THREE.Vector3(formPtCBC.x, formPtCBC.y, formPtO1b.z),
    )
    form_group_f.add(greenface_ACCB);


    // var formTestEdge_1 = createCylinderMesh(formBtPt1,formPtO1new,forceEdgeMaterial,0.05,0.05)
    // form_group_e.add(formTestEdge_1)
    // var formTestEdge_2 = createCylinderMesh(formBtPt2,formPtO2new,forceEdgeMaterial,0.05,0.05)
    // form_group_e.add(formTestEdge_2)
    // var formTestEdge_3 = createCylinderMesh(formBtPt3,formPtO3new,forceEdgeMaterial,0.05,0.05)
    // form_group_e.add(formTestEdge_3)

    // var formTestEdge_4 = createCylinderMesh(formPtAAB,formPtO1new,forceEdgeMaterial,0.02,0.02)
    // form_group_e.add(formTestEdge_4)
    // var formTestEdge_5 = createCylinderMesh(formPtBAB,formPtO1new,forceEdgeMaterial,0.02,0.02)
    // form_group_e.add(formTestEdge_5)
    // var formTestEdge_6 = createCylinderMesh(formPtBBC,formPtO2new,forceEdgeMaterial,0.02,0.02)
    // form_group_e.add(formTestEdge_6)
    // var formTestEdge_7 = createCylinderMesh(formPtCBC,formPtO2new,forceEdgeMaterial,0.02,0.02)
    // form_group_e.add(formTestEdge_7)
    // var formTestEdge_8 = createCylinderMesh(formPtAAC,formPtO3new,forceEdgeMaterial,0.02,0.02)
    // form_group_e.add(formTestEdge_8)
    // var formTestEdge_9 = createCylinderMesh(formPtCAC,formPtO3new,forceEdgeMaterial,0.02,0.02)
    // form_group_e.add(formTestEdge_9)

    // var formTestEdge_10 = createCylinderMesh(formPtAAB,formPtAmidAB,forceEdgeMaterial,0.01,0.01)
    // form_group_e.add(formTestEdge_10)
    // var formTestEdge_11 = createCylinderMesh(formPtBAB,formPtAmidAB,forceEdgeMaterial,0.01,0.01)
    // form_group_e.add(formTestEdge_11)
    // var formTestEdge_12 = createCylinderMesh(formPtAAC,formPtCmidAC,forceEdgeMaterial,0.01,0.01)
    // form_group_e.add(formTestEdge_12)
    // var formTestEdge_13 = createCylinderMesh(formPtCAC,formPtCmidAC,forceEdgeMaterial,0.01,0.01)
    // form_group_e.add(formTestEdge_13)
    // var formTestEdge_14 = createCylinderMesh(formPtBBC,formPtCmidBC,forceEdgeMaterial,0.01,0.01)
    // form_group_e.add(formTestEdge_14)
    // var formTestEdge_15 = createCylinderMesh(formPtCBC,formPtCmidBC,forceEdgeMaterial,0.01,0.01)
    // form_group_e.add(formTestEdge_15)

    // var formTestEdge_16 = createCylinderMesh(formPtCmidAC,formPtMid,forceEdgeMaterial,0.01,0.01)
    // form_group_e.add(formTestEdge_16)
    // var formTestEdge_17 = createCylinderMesh(formPtMid,formPtCmidBC,forceEdgeMaterial,0.01,0.01)
    // form_group_e.add(formTestEdge_17)
    // var formTestEdge_18 = createCylinderMesh(formPtMid,formPtAmidAB,forceEdgeMaterial,0.01,0.01)
    // form_group_e.add(formTestEdge_18)

    // var formTestEdge_19 = createCylinderMesh(formPtAAB,formPtAAC,forceEdgeMaterial,0.01,0.01)
    // form_group_e.add(formTestEdge_19)
    // var formTestEdge_20 = createCylinderMesh(formPtBAB,formPtBBC,forceEdgeMaterial,0.01,0.01)
    // form_group_e.add(formTestEdge_20)
    // var formTestEdge_21 = createCylinderMesh(formPtCAC,formPtCBC,forceEdgeMaterial,0.01,0.01)
    // form_group_e.add(formTestEdge_21)
    function addApplyarrow(formPtO2, formPtO2b) {
        var arrowgroup = new THREE.Group();
        var arrow_apply = new THREE.MeshPhongMaterial({color: 0x009600});
        var arrow_apply_outline = new THREE.MeshBasicMaterial({
            color: "white",
            transparent: false,
            side: THREE.BackSide
        });
        var apply_arrow2 = createCylinderArrowMesh(formPtO2, new THREE.Vector3(formPtO2.x, formPtO2.y, formPtO2.z - 0.4), arrow_apply, 0.02, 0.05, 0.56);
        arrowgroup.add(apply_arrow2);
        var apply_arrow22 = createCylinderArrowMesh(new THREE.Vector3(formPtO2.x, formPtO2.y, formPtO2.z + 0.005), new THREE.Vector3(formPtO2.x, formPtO2.y, formPtO2.z - 0.425), arrow_apply_outline, 0.025, 0.06, 0.53);
        arrowgroup.add(apply_arrow22);

        var apply_o2B = [];
        apply_o2B.push(formPtO2);
        apply_o2B.push(formPtO2b);
        var apply_2_geo = new THREE.BufferGeometry().setFromPoints(apply_o2B);
        var applyline_o2B = new THREE.LineSegments(apply_2_geo, applyline_dash_form_unhide);
        applyline_o2B.computeLineDistances();//compute
        arrowgroup.add(applyline_o2B);
        return arrowgroup
    }


    function findINSecPt(dir1a, dir1b, dir1c, dir2a, dir2b, dir2c, edgescale, stPt1, stP2) {
        var forcePtC1temp = CalNormalVectorUpdated(dir1a, dir1b, dir1c, edgescale);
        var forcePtC1 = new THREE.Vector3(stPt1.x - forcePtC1temp.x, stPt1.y - forcePtC1temp.y, stPt1.z - forcePtC1temp.z);

        var forcePtC2temp = CalNormalVectorUpdated(dir2a, dir2b, dir2c, edgescale);
        var forcePtC2 = new THREE.Vector3(stP2.x - forcePtC2temp.x, stP2.y - forcePtC2temp.y, stP2.z - forcePtC2temp.z);

        var dirBC = new THREE.Vector3(); // create once an reuse it

        dirBC.subVectors(stPt1, forcePtC1).normalize();

        var dirAC = new THREE.Vector3(); // create once an reuse it

        dirAC.subVectors(forcePtC2, stP2).normalize();
        return LinesSectPt(dirBC, stPt1, dirAC, stP2)
    }


    // ************************* functions
    function addVerticeWOut(size, location, group) {
        var materialpointo = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
        var outlineMaterial = new THREE.MeshBasicMaterial({
            color: "black",
            transparent: false,
            side: THREE.BackSide
        });
        var spformPointO1 = new THREE.SphereGeometry(size);
        var new_formPtO1 = new THREE.Mesh(spformPointO1, materialpointo);
        new_formPtO1.position.copy(location);
        new_formPtO1.castShadow = true;
        var outlineMeshnew1 = new THREE.Mesh(spformPointO1, outlineMaterial);
        outlineMeshnew1.position.copy(location);
        outlineMeshnew1.scale.multiplyScalar(1.55);
        group.add(new_formPtO1);
        group.add(outlineMeshnew1);
    }

    //formPt2
    create_trial_intec(formPtO2new, forcePtC, TrialP_O, forcePtB, formBtPt2, new THREE.Vector3(formBtPt2.x, formBtPt2.y, formBtPt2.z - 1));
    var trial_o3 = create_trial_intec(trial_o1, forcePtD, TrialP_O, forcePtA, formPtO3, formPtO3b);
    //trial_P3
    create_trial_intec(trial_o3, forcePtA, TrialP_O, forcePtC, formBtPt3, new THREE.Vector3(formBtPt3.x, formBtPt3.y, formBtPt3.z - 1));
    //New Point o1, o2 ,o3
    var materialpointo = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
    var outlineMaterial = new THREE.MeshBasicMaterial({color: "black", transparent: false, side: THREE.BackSide});

    var spformPointO1 = new THREE.SphereGeometry(0.04);
    var new_formPtO1 = new THREE.Mesh(spformPointO1, materialpointo);
    new_formPtO1.position.copy(formPtO1new);
    new_formPtO1.castShadow = true;
    var outlineMeshnew1 = new THREE.Mesh(spformPointO1, outlineMaterial);
    outlineMeshnew1.position.copy(formPtO1new);
    outlineMeshnew1.scale.multiplyScalar(1.55);
    form_group_v.add(new_formPtO1);
    form_group_v.add(outlineMeshnew1);

    var spformPointO2 = new THREE.SphereGeometry(0.04);
    var new_formPtO2 = new THREE.Mesh(spformPointO2, materialpointo);
    new_formPtO2.position.copy(formPtO2new);
    new_formPtO2.castShadow = true;
    var outlineMeshnew2 = new THREE.Mesh(spformPointO2, outlineMaterial);
    outlineMeshnew2.position.copy(formPtO2new);
    outlineMeshnew2.scale.multiplyScalar(1.55);
    form_group_v.add(new_formPtO2);
    form_group_v.add(outlineMeshnew2);

    var spformPointO3 = new THREE.SphereGeometry(0.04);
    var new_formPtO3 = new THREE.Mesh(spformPointO3, materialpointo);
    new_formPtO3.position.copy(formPtO3new);
    new_formPtO3.castShadow = true;
    var outlineMeshnew3 = new THREE.Mesh(spformPointO3, outlineMaterial);
    outlineMeshnew3.position.copy(formPtO3new);
    outlineMeshnew3.scale.multiplyScalar(1.55);
    form_group_v.add(new_formPtO3);
    form_group_v.add(outlineMeshnew3);

    var TXformNode1 = createSpriteText('1', "", new THREE.Vector3(formBtPt1.x, formBtPt1.y, formBtPt1.z + 0.1));
    form_general.add(TXformNode1);
    var TXformNode2 = createSpriteText('2', "", new THREE.Vector3(formBtPt2.x, formBtPt2.y, formBtPt2.z + 0.1));
    form_general.add(TXformNode2);
    var TXformNode3 = createSpriteText('3', "", new THREE.Vector3(formBtPt3.x, formBtPt3.y, formBtPt3.z + 0.1));
    form_general.add(TXformNode3);
    // var TXformNode4 = createSpriteText ('4', "", new THREE.Vector3(formPtO1new.x, formPtO1new.y, formPtO1new.z+0.1));
    // form_general.add(TXformNode4);
    // var TXformNode4 = createSpriteText ('5', "", new THREE.Vector3(formPtO2new.x, formPtO2new.y, formPtO2new.z+0.1));
    // form_general.add(TXformNode4);
    // var TXformNode4 = createSpriteText ('6', "", new THREE.Vector3(formPtO3new.x, formPtO3new.y, formPtO3new.z+0.1));
    // form_general.add(TXformNode4);

    // ****************************** Cal areas (old not use) ******************************
    //Cal areas
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

    var areaADO1 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtA, ForceO1),
        new THREE.Vector3().subVectors(forcePtD, ForceO1),
    ).length() / 2

    var areaBDO1 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtB, ForceO1),
        new THREE.Vector3().subVectors(forcePtD, ForceO1),
    ).length() / 2

    var areaCDO1 = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtC, ForceO1),
        new THREE.Vector3().subVectors(forcePtD, ForceO1),
    ).length() / 2


    // var areaMax = Math.max(areaACO1, areaABO1, areaBCO1, areaADO1, areaBDO1, areaCDO1);

    // ****************************** Cal areas (old not use) ******************************

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
    var formedgeColor1, formedgeColor2, formedgeColor3, formedgeColor4, formedgeColor5, formedgeColor6


    // ****************************** Cal areas (new) ******************************
    // exterior
    var areaABO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtB, ForceO1),
        new THREE.Vector3().subVectors(forcePtA, ForceO1),
    ).length() / 2

    var areaBCO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtB, ForceO1),
        new THREE.Vector3().subVectors(forcePtC, ForceO1),
    ).length() / 2

    var areaACO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtA, ForceO1),
        new THREE.Vector3().subVectors(forcePtC, ForceO1),
    ).length() / 2

    //interior - level 1
    var areaAABO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtAB, ForceO1),
        new THREE.Vector3().subVectors(forcePtA, ForceO1),
    ).length() / 2
    var areaBABO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtAB, ForceO1),
        new THREE.Vector3().subVectors(forcePtB, ForceO1),
    ).length() / 2

    var areaAACO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtAC, ForceO1),
        new THREE.Vector3().subVectors(forcePtB, ForceO1),
    ).length() / 2
    var areaCACO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtAC, ForceO1),
        new THREE.Vector3().subVectors(forcePtC, ForceO1),
    ).length() / 2

    var areaBBCO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtBC, ForceO1),
        new THREE.Vector3().subVectors(forcePtB, ForceO1),
    ).length() / 2
    var areaCBCO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtBC, ForceO1),
        new THREE.Vector3().subVectors(forcePtC, ForceO1),
    ).length() / 2

    //interior - level 2
    var areaAAmidO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtAmid, ForceO1),
        new THREE.Vector3().subVectors(forcePtA, ForceO1),
    ).length() / 2

    var areaBBmidO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtBmid, ForceO1),
        new THREE.Vector3().subVectors(forcePtB, ForceO1),
    ).length() / 2

    var areaCCmidO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtBmid, ForceO1),
        new THREE.Vector3().subVectors(forcePtB, ForceO1),
    ).length() / 2

    //interior - level 3
    var areaABAmidO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtAmid, ForceO1),
        new THREE.Vector3().subVectors(forcePtAB, ForceO1),
    ).length() / 2
    var areaABBmidO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtBmid, ForceO1),
        new THREE.Vector3().subVectors(forcePtAB, ForceO1),
    ).length() / 2
    var areaAmidBmidO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtBmid, ForceO1),
        new THREE.Vector3().subVectors(forcePtAmid, ForceO1),
    ).length() / 2

    var areaACAmidO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtAmid, ForceO1),
        new THREE.Vector3().subVectors(forcePtAC, ForceO1),
    ).length() / 2
    var areaACCmidO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtCmid, ForceO1),
        new THREE.Vector3().subVectors(forcePtAC, ForceO1),
    ).length() / 2
    var areaAmidCmidO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtCmid, ForceO1),
        new THREE.Vector3().subVectors(forcePtAmid, ForceO1),
    ).length() / 2

    var areaBCBmidO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtBmid, ForceO1),
        new THREE.Vector3().subVectors(forcePtBC, ForceO1),
    ).length() / 2
    var areaBCCmidO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtCmid, ForceO1),
        new THREE.Vector3().subVectors(forcePtBC, ForceO1),
    ).length() / 2
    var areaBmidCmidO = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(forcePtCmid, ForceO1),
        new THREE.Vector3().subVectors(forcePtBmid, ForceO1),
    ).length() / 2

    var areaMax = Math.max(
        areaABO, areaBCO, areaACO,
        areaAABO, areaBABO, areaBBCO, areaCBCO, areaAACO, areaCACO,
        areaAAmidO, areaBBmidO, areaCCmidO,
        areaABAmidO, areaABBmidO, areaAmidBmidO,
        areaBCBmidO, areaBCCmidO, areaBmidCmidO,
        areaACAmidO, areaACCmidO, areaAmidCmidO
    );

    function drawForceFaceFormEdge(pt1, pt2, pt3, formPt1, formPt2, size, areaMax, formedgeColor1, internal) {
        // triangle ABO1 - 1
        var normalABO1_a = subVec(pt1, pt2)
        var normalABO1_b = subVec(pt2, pt3)
        var normalABO1 = cross(normalABO1_a, normalABO1_b)
        var edgePt1O1 = subVec(formPt1, formPt2);
        var resultPt1O1 = normalABO1.dot(edgePt1O1);

        var areaABO1 = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(pt1, pt3),
            new THREE.Vector3().subVectors(pt2, pt3),
        ).length() / 2

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
            var forceFaceABO1 = ForceFace3pt(pt1, pt2, pt3, formedgeColor1);
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
            var forceFaceABO1 = ForceFace3pt(pt1, pt2, pt3, formedgeColor1);
        }
        var formEdgePt1O1Material = new THREE.MeshPhongMaterial({
            color: formedgeColor1
        });
        force_group_f.add(forceFaceABO1)
        //force_general.add(ForceFaceNormalsArrow(forcePtA,forcePtB, ForceO1, 0.4, forceEdgePt1O1Material,forceNormalMaterialOutline,"1", false))

        // var radiusABO1 = 0.1 * (new THREE.Vector3().crossVectors(
        //   new THREE.Vector3().subVectors(forcePtA, ForceO1),
        //   new THREE.Vector3().subVectors( forcePtB, ForceO1 ),
        //   ).length()/2)
        // radiusABO1 = THREE.MathUtils.clamp(radiusABO1, 0.05, 0.15);

        // var ABO1arrow = createCircleFaceArrow(face_center(forcePtA, forcePtB, ForceO1), radiusABO1,
        //   cross(subVecUpdated(forcePtB, forcePtA),subVecUpdated(forcePtA, ForceO1)))
        // force_general.add(ABO1arrow);


        var edgeSize1 = areaABO1 * size;
        edgeSize1 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);

        //create end sphere for bottom vertice 1
        var ClosestPt1 = new THREE.Vector3()
        var ClosestPtSp = new THREE.Sphere(new THREE.Vector3(formPt1.x, formPt1.y, formPt1.z), 0.09);
        ClosestPtSp.clampPoint(formPt2, ClosestPt1);

        var ClosestPt2 = new THREE.Vector3()
        var ClosestPtSp2 = new THREE.Sphere(new THREE.Vector3(formPt2.x, formPt2.y, formPt2.z), 0.09);
        ClosestPtSp2.clampPoint(formPt1, ClosestPt2);


        const endPtVertice1Sp = addEdgeSphere(edgeSize1, ClosestPt2, formedgeColor1)

        const formEdge1 = createCylinderMesh(ClosestPt1, ClosestPt2, formEdgePt1O1Material, edgeSize1, edgeSize1);

        if (internal == true) {
            // const endPtVertice1SpV2 = addVectorAlongDir(formPt2, formPt1, -0.10);
            const endPtVertice1Sp2 = addEdgeSphere(edgeSize1, ClosestPt1, formedgeColor1)
            form_group_e.add(endPtVertice1Sp2)
        }
        form_group_e.add(endPtVertice1Sp)
        form_group_e.add(formEdge1)
    }


    var colorABO, colorBCO, colorACO, colorAABO, colorBABO, colorBBCO, colorCBCO, colorCACO, colorAACO
    drawForceFaceFormEdge(forcePtB, forcePtA, ForceO1, formBtPt1, formPtO1new, 0.05, areaMax, colorABO, false)
    drawForceFaceFormEdge(forcePtC, forcePtB, ForceO1, formBtPt2, formPtO2new, 0.05, areaMax, colorBCO, false)
    drawForceFaceFormEdge(forcePtA, forcePtC, ForceO1, formBtPt3, formPtO3new, 0.05, areaMax, colorACO, false)

    drawForceFaceFormEdge(forcePtAB, forcePtA, ForceO1, formPtO1new, formPtAAB, 0.05, areaMax, colorAABO, true)
    drawForceFaceFormEdge(forcePtB, forcePtAB, ForceO1, formPtO1new, formPtBAB, 0.05, areaMax, colorBABO, true)

    drawForceFaceFormEdge(forcePtBC, forcePtB, ForceO1, formPtO2new, formPtBBC, 0.05, areaMax, colorBBCO, true)
    drawForceFaceFormEdge(forcePtC, forcePtBC, ForceO1, formPtO2new, formPtCBC, 0.05, areaMax, colorCBCO, true)

    drawForceFaceFormEdge(forcePtAC, forcePtC, ForceO1, formPtO3new, formPtCAC, 0.05, areaMax, colorCACO, true)
    drawForceFaceFormEdge(forcePtA, forcePtAC, ForceO1, formPtO3new, formPtAAC, 0.05, areaMax, colorAACO, true)

    var colorAmidAB, colorBmidAB, colorAmidBmid
    drawForceFaceFormEdge(forcePtAB, forcePtAmid, ForceO1, formPtAAB, formPtAmidAB, 0.08, areaMax, colorAmidAB, true)
    drawForceFaceFormEdge(forcePtBmid, forcePtAB, ForceO1, formPtBAB, formPtAmidAB, 0.08, areaMax, colorBmidAB, true)
    drawForceFaceFormEdge(forcePtBmid, forcePtAmid, ForceO1, formPtAmidAB, formPtMid, 0.08, areaMax, colorAmidBmid, true)

    var colorBmidBC, colorCmidBC, colorBmidCmid
    drawForceFaceFormEdge(forcePtBC, forcePtBmid, ForceO1, formPtBBC, formPtCmidBC, 0.08, areaMax, colorBmidBC, true)
    drawForceFaceFormEdge(forcePtCmid, forcePtBC, ForceO1, formPtCBC, formPtCmidBC, 0.08, areaMax, colorCmidBC, true)
    drawForceFaceFormEdge(forcePtCmid, forcePtBmid, ForceO1, formPtCmidBC, formPtMid, 0.08, areaMax, colorBmidCmid, true)

    var colorCmidAC, colorAmidAC, colorAmidCmid
    drawForceFaceFormEdge(forcePtAC, forcePtCmid, ForceO1, formPtCAC, formPtCmidAC, 0.08, areaMax, colorCmidAC, true)
    drawForceFaceFormEdge(forcePtAmid, forcePtAC, ForceO1, formPtAAC, formPtCmidAC, 0.08, areaMax, colorAmidAC, true)
    drawForceFaceFormEdge(forcePtAmid, forcePtCmid, ForceO1, formPtCmidAC, formPtMid, 0.08, areaMax, colorAmidCmid, true)

    var colorAmidA
    drawForceFaceFormEdge(forcePtAmid, forcePtA, ForceO1, formPtAAB, formPtAAC, 0.05, areaMax, colorAmidA, true)
    var colorCmidC
    drawForceFaceFormEdge(forcePtCmid, forcePtC, ForceO1, formPtCAC, formPtCBC, 0.05, areaMax, colorCmidC, true)
    var colorBmidB
    drawForceFaceFormEdge(forcePtBmid, forcePtB, ForceO1, formPtBBC, formPtBAB, 0.05, areaMax, colorBmidB, true)

// triangle ABO1 - 1
    var normalABO1_a = subVec(forcePtB, forcePtA)
    var normalABO1_b = subVec(forcePtA, ForceO1)
    var normalABO1 = cross(normalABO1_a, normalABO1_b)
    var edgePt1O1 = subVec(formBtPt1, formPtO1new);
    var resultPt1O1 = normalABO1.dot(edgePt1O1)

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
    force_group_f.add(forceFaceABO1)
    var forceFaceABO1glob = ForceFace3pt(forcePtA, forcePtB, ForceO1, 0x014F06)
    force_general_global.add(forceFaceABO1glob)

    //draw face normals in the force diagram
    if (ForceO1.z < 0) {

        var forceFaceABO1center = face_center(forcePtA, forcePtB, ForceO1);
        const endforceFaceABO1a = subVecUpdated(formBtPt1, formPtO1new);
        var endforceFaceABO1b = drawArrowfromVec(forceFaceABO1center, endforceFaceABO1a, 0.01)
        const endPtArrowABO1b1 = addVectorAlongDir(forceFaceABO1center, endforceFaceABO1b, 0.01);
        const endPtArrowABO1b2 = addVectorAlongDir(forceFaceABO1center, endforceFaceABO1b, 0.45);

        var ABO1arrow1 = createCylinderArrowMesh(endPtArrowABO1b2, endPtArrowABO1b1, formEdgePt1O1Material, 0.02, 0.05, 0.56);
        force_general.add(ABO1arrow1);
        var ABO1arrow12 = createCylinderArrowMesh(endPtArrowABO1b2, endPtArrowABO1b1, arrow_apply_outline, 0.025, 0.06, 0.56);
        force_general.add(ABO1arrow12);
        var TXfaceNormal1 = createSpriteTextApply('n', "4", new THREE.Vector3(endPtArrowABO1b2.x, endPtArrowABO1b2.y, endPtArrowABO1b2.z + 0.1));
        force_general.add(TXfaceNormal1);

        var ABO1arrow1Glob = createCylinderArrowMesh(endPtArrowABO1b2, endPtArrowABO1b1, arrow_applyGlob, 0.02, 0.05, 0.56);
        force_general_global.add(ABO1arrow1Glob);
        var ABO1arrow12Glob = createCylinderArrowMesh(endPtArrowABO1b2, endPtArrowABO1b1, arrow_apply_outlineGlob, 0.025, 0.06, 0.56);
        force_general_global.add(ABO1arrow12Glob);

        var ABO1arrow = createCircleFaceArrow(forceFaceABO1center, 0.15, cross(subVecUpdated(ForceO1, forcePtB), subVecUpdated(forcePtB, forcePtA)))
        force_general.add(ABO1arrow);


    } else {
        var forceFaceABO1center = face_center(forcePtA, forcePtB, ForceO1);
        const endforceFaceABO1a = subVecUpdated(formBtPt1, formPtO1new);
        var endforceFaceABO1b = drawArrowfromVec(forceFaceABO1center, endforceFaceABO1a, 0.01)
        const endPtArrowABO1b1 = addVectorAlongDir(forceFaceABO1center, endforceFaceABO1b, 0.01);
        const endPtArrowABO1b2 = addVectorAlongDir(forceFaceABO1center, endforceFaceABO1b, 0.45);

        var ABO1arrow1 = createCylinderArrowMesh(endPtArrowABO1b1, endPtArrowABO1b2, formEdgePt1O1Material, 0.02, 0.05, 0.56);
        force_general.add(ABO1arrow1);
        var ABO1arrow12 = createCylinderArrowMesh(endPtArrowABO1b1, endPtArrowABO1b2, arrow_apply_outline, 0.025, 0.06, 0.56);
        force_general.add(ABO1arrow12);
        var TXfaceNormal1 = createSpriteTextApply('n', "4", new THREE.Vector3(endPtArrowABO1b2.x, endPtArrowABO1b2.y, endPtArrowABO1b2.z + 0.1));
        force_general.add(TXfaceNormal1);

        var ABO1arrow1Glob = createCylinderArrowMesh(endPtArrowABO1b1, endPtArrowABO1b2, arrow_applyGlob, 0.02, 0.05, 0.56);
        force_general_global.add(ABO1arrow1Glob);
        var ABO1arrow12Glob = createCylinderArrowMesh(endPtArrowABO1b1, endPtArrowABO1b2, arrow_apply_outlineGlob, 0.025, 0.06, 0.56);
        force_general_global.add(ABO1arrow12Glob);

        var ABO1arrow = createCircleFaceArrow(forceFaceABO1center, 0.15, cross(subVecUpdated(ForceO1, forcePtB), subVecUpdated(forcePtB, forcePtA)))
        force_general.add(ABO1arrow);
    }
    var edgeSize1 = areaABO1 * 0.02;
    edgeSize1 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);

    //create end sphere for bottom vertice 1
    const endPtVertice1SpV = addVectorAlongDir(formBtPt1, formPtO1new, -0.1);
    addEdgeSphere(edgeSize1, endPtVertice1SpV, formedgeColor1)
    //create edge bottom vertice 1
    const endPtVertice1 = addVectorAlongDir(formPtO1new, formBtPt1, -0.08);
    createCylinderMesh(endPtVertice1SpV, endPtVertice1, formEdgePt1O1Material, edgeSize1, edgeSize1);

    // form_group_e.add(endPtVertice1Sp)
    // form_group_e.add(formEdge1)

    var apply_1o1 = [];
    apply_1o1.push(endPtVertice1SpV);
    apply_1o1.push(endPtVertice1);
    var apply_1_glob = new THREE.BufferGeometry().setFromPoints(apply_1o1);
    var applyline_o1Bglob = new THREE.LineSegments(apply_1_glob, applyline_dash_glob);
    applyline_o1Bglob.computeLineDistances();//compute
    form_general_global.add(applyline_o1Bglob);

    if (ForceO1.z < 0) {
        const endPtArrowVertice1 = addVectorAlongDir(formPtO1new, formBtPt1, 0.1);
        const endPtArrowVertice12 = addVectorAlongDir(formPtO1new, formBtPt1, 0.45);
        var apply_Rarrow1 = createCylinderArrowMesh(endPtArrowVertice12, endPtArrowVertice1, arrow_applyGlob, 0.02, 0.05, 0.56);
        form_general_global.add(apply_Rarrow1);
        var apply_Rarrow12 = createCylinderArrowMesh(endPtArrowVertice12, endPtArrowVertice1, arrow_apply_outlineGlob, 0.025, 0.06, 0.56);
        form_general_global.add(apply_Rarrow12);
    } else {
        const endPtArrowVertice1 = addVectorAlongDir(formPtO1new, formBtPt1, 0.1);
        const endPtArrowVertice12 = addVectorAlongDir(formPtO1new, formBtPt1, 0.45);
        var apply_Rarrow1 = createCylinderArrowMesh(endPtArrowVertice1, endPtArrowVertice12, arrow_applyGlob, 0.02, 0.05, 0.56);
        form_general_global.add(apply_Rarrow1);
        var apply_Rarrow12 = createCylinderArrowMesh(endPtArrowVertice1, endPtArrowVertice12, arrow_apply_outlineGlob, 0.025, 0.06, 0.56);
        form_general_global.add(apply_Rarrow12);
    }

    // triangle BCO1 -2
    var normalBCO1_a = subVec(forcePtC, forcePtB)
    var normalBCO1_b = subVec(forcePtB, ForceO1)
    var normalBCO1 = cross(normalBCO1_a, normalBCO1_b)
    var edgePt2O2 = subVec(formBtPt2, formPtO2new);
    var resultPt2O1 = normalBCO1.dot(edgePt2O2)

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
    var formEdgePt2O2Material = new THREE.MeshPhongMaterial({
        color: formedgeColor2
    });
    force_group_f.add(forceFaceBCO1)
    var forceFaceBCO1glob = ForceFace3pt(forcePtB, forcePtC, ForceO1, 0x014F06)
    force_general_global.add(forceFaceBCO1glob)
//draw face normals in the force diagram

    if (ForceO1.z < 0) {
        var forceFaceBCO1center = face_center(forcePtB, forcePtC, ForceO1);
        const endforceFaceBCO1a = subVecUpdated(formBtPt2, formPtO2new);
        var endforceFaceBCO1b = drawArrowfromVec(forceFaceBCO1center, endforceFaceBCO1a, 0.01)
        const endPtArrowBCO1b1 = addVectorAlongDir(forceFaceBCO1center, endforceFaceBCO1b, 0.01);
        const endPtArrowBCO1b2 = addVectorAlongDir(forceFaceBCO1center, endforceFaceBCO1b, 0.45);

        var BCO1arrow1 = createCylinderArrowMesh(endPtArrowBCO1b2, endPtArrowBCO1b1, formEdgePt2O2Material, 0.02, 0.05, 0.56);
        force_general.add(BCO1arrow1);
        var BCO1arrow12 = createCylinderArrowMesh(endPtArrowBCO1b2, endPtArrowBCO1b1, arrow_apply_outline, 0.025, 0.06, 0.56);
        force_general.add(BCO1arrow12);
        var TXfaceNormal2 = createSpriteTextApply('n', "5", new THREE.Vector3(endPtArrowBCO1b2.x, endPtArrowBCO1b2.y, endPtArrowBCO1b2.z + 0.1));
        force_general.add(TXfaceNormal2);

        var BCO1arrow1Glob = createCylinderArrowMesh(endPtArrowBCO1b2, endPtArrowBCO1b1, arrow_applyGlob, 0.02, 0.05, 0.56);
        force_general_global.add(BCO1arrow1Glob);
        var BCO1arrow12Glob = createCylinderArrowMesh(endPtArrowBCO1b2, endPtArrowBCO1b1, arrow_apply_outlineGlob, 0.025, 0.06, 0.56);
        force_general_global.add(BCO1arrow12Glob);

        var BCO1arrow = createCircleFaceArrow(forceFaceBCO1center, 0.15, cross(subVecUpdated(ForceO1, forcePtC), subVecUpdated(forcePtC, forcePtB)))
        force_general.add(BCO1arrow);


    } else {
        var forceFaceBCO1center = face_center(forcePtB, forcePtC, ForceO1);
        const endforceFaceBCO1a = subVecUpdated(formBtPt2, formPtO2new);
        var endforceFaceBCO1b = drawArrowfromVec(forceFaceBCO1center, endforceFaceBCO1a, 0.01)
        const endPtArrowBCO1b1 = addVectorAlongDir(forceFaceBCO1center, endforceFaceBCO1b, 0.01);
        const endPtArrowBCO1b2 = addVectorAlongDir(forceFaceBCO1center, endforceFaceBCO1b, 0.45);

        var BCO1arrow1 = createCylinderArrowMesh(endPtArrowBCO1b1, endPtArrowBCO1b2, formEdgePt2O2Material, 0.02, 0.05, 0.56);
        force_general.add(BCO1arrow1);
        var BCO1arrow12 = createCylinderArrowMesh(endPtArrowBCO1b1, endPtArrowBCO1b2, arrow_apply_outline, 0.025, 0.06, 0.56);
        force_general.add(BCO1arrow12);
        var TXfaceNormal2 = createSpriteTextApply('n', "5", new THREE.Vector3(endPtArrowBCO1b2.x, endPtArrowBCO1b2.y, endPtArrowBCO1b2.z + 0.1));
        force_general.add(TXfaceNormal2);

        var BCO1arrow1Glob = createCylinderArrowMesh(endPtArrowBCO1b1, endPtArrowBCO1b2, arrow_applyGlob, 0.02, 0.05, 0.56);
        force_general_global.add(BCO1arrow1Glob);
        var BCO1arrow12Glob = createCylinderArrowMesh(endPtArrowBCO1b1, endPtArrowBCO1b2, arrow_apply_outlineGlob, 0.025, 0.06, 0.56);
        force_general_global.add(BCO1arrow12Glob);
        var BCO1arrow = createCircleFaceArrow(forceFaceBCO1center, 0.15, cross(subVecUpdated(ForceO1, forcePtC), subVecUpdated(forcePtC, forcePtB)))
        force_general.add(BCO1arrow);

    }


    var edgeSize2 = areaBCO1 * 0.02;
    edgeSize2 = THREE.MathUtils.clamp(edgeSize2, 0.01, 0.5);

    //create end sphere for bottom vertice 1
    const endPtVertice2SpV = addVectorAlongDir(formBtPt2, formPtO2new, -0.1);
    addEdgeSphere(edgeSize2, endPtVertice2SpV, formedgeColor2)
    //create edge bottom vertice 1
    const endPtVertice2 = addVectorAlongDir(formPtO2new, formBtPt2, -0.08);
    createCylinderMesh(endPtVertice2SpV, endPtVertice2, formEdgePt2O2Material, edgeSize2, edgeSize2);

    // form_group_e.add(endPtVertice2Sp)
    // form_group_e.add(formEdge2)

    var apply_1o12 = [];
    apply_1o12.push(endPtVertice2SpV);
    apply_1o12.push(endPtVertice2);
    var apply_1_glob2 = new THREE.BufferGeometry().setFromPoints(apply_1o12);
    var applyline_o1Bglob2 = new THREE.LineSegments(apply_1_glob2, applyline_dash_glob);
    applyline_o1Bglob2.computeLineDistances();//compute
    form_general_global.add(applyline_o1Bglob2);


    if (ForceO1.z < 0) {
        const endPtArrowVertice2 = addVectorAlongDir(formPtO2new, formBtPt2, 0.1);
        const endPtArrowVertice22 = addVectorAlongDir(formPtO2new, formBtPt2, 0.45);
        var apply_Rarrow2 = createCylinderArrowMesh(endPtArrowVertice22, endPtArrowVertice2, arrow_applyGlob, 0.02, 0.05, 0.56);
        form_general_global.add(apply_Rarrow2);
        var apply_Rarrow22 = createCylinderArrowMesh(endPtArrowVertice22, endPtArrowVertice2, arrow_apply_outlineGlob, 0.025, 0.06, 0.56);
        form_general_global.add(apply_Rarrow22);
    } else {
        const endPtArrowVertice2 = addVectorAlongDir(formPtO2new, formBtPt2, 0.1);
        const endPtArrowVertice22 = addVectorAlongDir(formPtO2new, formBtPt2, 0.45);
        var apply_Rarrow2 = createCylinderArrowMesh(endPtArrowVertice2, endPtArrowVertice22, arrow_applyGlob, 0.02, 0.05, 0.56);
        form_general_global.add(apply_Rarrow2);
        var apply_Rarrow22 = createCylinderArrowMesh(endPtArrowVertice2, endPtArrowVertice22, arrow_apply_outlineGlob, 0.025, 0.06, 0.56);
        form_general_global.add(apply_Rarrow22);
    }

    // triangle ACO1 - 3
    var normalACO1_a = subVec(forcePtA, forcePtC);
    var normalACO1_b = subVec(forcePtC, ForceO1);
    var normalACO1 = cross(normalACO1_a, normalACO1_b);
    var edgePt3O3 = subVec(formBtPt3, formPtO3new);
    var resultPtO1O3 = normalACO1.dot(edgePt3O3);

    if (resultPtO1O3 < 0) {
        if (areaACO1 / areaMax >= 0.75) {
            formedgeColor3 = 0x0F3150
        }
        if (0.5 <= areaACO1 / areaMax && areaACO1 / areaMax < 0.75) {
            formedgeColor3 = 0x05416D
        }
        if (0.25 <= areaACO1 / areaMax && areaACO1 / areaMax < 0.5) {
            formedgeColor3 = 0x376D9B
        }
        if (0 <= areaACO1 / areaMax && areaACO1 / areaMax < 0.25) {
            formedgeColor3 = 0x5B84AE
        }
        var forceFaceACO1 = ForceFace3pt(forcePtC, forcePtA, ForceO1, formedgeColor3);
    } else {
        if (areaACO1 / areaMax >= 0.75) {
            formedgeColor3 = 0x80002F
        }
        if (0.5 <= areaACO1 / areaMax && areaACO1 / areaMax < 0.75) {
            formedgeColor3 = 0x940041
        }
        if (0.25 <= areaACO1 / areaMax && areaACO1 / areaMax < 0.5) {
            formedgeColor3 = 0xCC0549
        }
        if (0 <= areaACO1 / areaMax && areaACO1 / areaMax < 0.25) {
            formedgeColor3 = 0xD72F62
        }
        var forceFaceACO1 = ForceFace3pt(forcePtC, forcePtA, ForceO1, formedgeColor3);
    }

    var formEdgePt3O3Material = new THREE.MeshPhongMaterial({
        color: formedgeColor3
    });
    force_group_f.add(forceFaceACO1)
    var forceFaceACO1glob = ForceFace3pt(forcePtC, forcePtA, ForceO1, 0x014F06)
    force_general_global.add(forceFaceACO1glob)

    //draw face normals in the force diagram
    if (ForceO1.z < 0) {
        var forceFaceACO1center = face_center(forcePtA, forcePtC, ForceO1);
        const endforceFaceACO1a = subVecUpdated(formBtPt3, formPtO3new);
        var endforceFaceACO1b = drawArrowfromVec(forceFaceACO1center, endforceFaceACO1a, 0.01)
        const endPtArrowACO1b1 = addVectorAlongDir(forceFaceACO1center, endforceFaceACO1b, 0.01);
        const endPtArrowACO1b2 = addVectorAlongDir(forceFaceACO1center, endforceFaceACO1b, 0.45);

        var ACO1arrow1 = createCylinderArrowMesh(endPtArrowACO1b2, endPtArrowACO1b1, formEdgePt3O3Material, 0.02, 0.05, 0.56);
        force_general.add(ACO1arrow1);
        var ACO1arrow12 = createCylinderArrowMesh(endPtArrowACO1b2, endPtArrowACO1b1, arrow_apply_outline, 0.025, 0.06, 0.56);
        force_general.add(ACO1arrow12);
        var TXfaceNormal1 = createSpriteTextApply('n', "6", new THREE.Vector3(endPtArrowACO1b2.x, endPtArrowACO1b2.y, endPtArrowACO1b2.z + 0.1));
        force_general.add(TXfaceNormal1);

        var ACO1arrow1Glob = createCylinderArrowMesh(endPtArrowACO1b2, endPtArrowACO1b1, arrow_applyGlob, 0.02, 0.05, 0.56);
        force_general_global.add(ACO1arrow1Glob);
        var ACO1arrow12Glob = createCylinderArrowMesh(endPtArrowACO1b2, endPtArrowACO1b1, arrow_apply_outlineGlob, 0.025, 0.06, 0.56);
        force_general_global.add(ACO1arrow12Glob);

        var ACO1arrow = createCircleFaceArrow(forceFaceACO1center, 0.15, cross(subVecUpdated(ForceO1, forcePtA), subVecUpdated(forcePtA, forcePtC)))
        force_general.add(ACO1arrow);

    } else {
        var forceFaceACO1center = face_center(forcePtA, forcePtC, ForceO1);
        const endforceFaceACO1a = subVecUpdated(formBtPt3, formPtO3new);
        var endforceFaceACO1b = drawArrowfromVec(forceFaceACO1center, endforceFaceACO1a, 0.01)
        const endPtArrowACO1b1 = addVectorAlongDir(forceFaceACO1center, endforceFaceACO1b, 0.01);
        const endPtArrowACO1b2 = addVectorAlongDir(forceFaceACO1center, endforceFaceACO1b, 0.45);

        var ACO1arrow1 = createCylinderArrowMesh(endPtArrowACO1b1, endPtArrowACO1b2, formEdgePt3O3Material, 0.02, 0.05, 0.56);
        force_general.add(ACO1arrow1);
        var ACO1arrow12 = createCylinderArrowMesh(endPtArrowACO1b1, endPtArrowACO1b2, arrow_apply_outline, 0.025, 0.06, 0.56);
        force_general.add(ACO1arrow12);
        var TXfaceNormal1 = createSpriteTextApply('n', "6", new THREE.Vector3(endPtArrowACO1b2.x, endPtArrowACO1b2.y, endPtArrowACO1b2.z + 0.1));
        force_general.add(TXfaceNormal1);

        var ACO1arrow1Glob = createCylinderArrowMesh(endPtArrowACO1b1, endPtArrowACO1b2, arrow_applyGlob, 0.02, 0.05, 0.56);
        force_general_global.add(ACO1arrow1Glob);
        var ACO1arrow12Glob = createCylinderArrowMesh(endPtArrowACO1b1, endPtArrowACO1b2, arrow_apply_outlineGlob, 0.025, 0.06, 0.56);
        force_general_global.add(ACO1arrow12Glob);

        var ACO1arrow = createCircleFaceArrow(forceFaceACO1center, 0.15, cross(subVecUpdated(ForceO1, forcePtA), subVecUpdated(forcePtA, forcePtC)))
        force_general.add(ACO1arrow);
    }

    var edgeSize3 = areaACO1 * 0.02;
    edgeSize3 = THREE.MathUtils.clamp(edgeSize3, 0.01, 0.5);

    //create end sphere for bottom vertice 1
    const endPtVertice3SpV = addVectorAlongDir(formBtPt3, formPtO3new, -0.1);
    addEdgeSphere(edgeSize3, endPtVertice3SpV, formedgeColor3)
    //create edge bottom vertice 1
    const endPtVertice3 = addVectorAlongDir(formPtO3new, formBtPt3, -0.08);
    createCylinderMesh(endPtVertice3SpV, endPtVertice3, formEdgePt3O3Material, edgeSize3, edgeSize3);

    // form_group_e.add(endPtVertice3Sp)
    // form_group_e.add(formEdge3)

    var apply_1o13 = [];
    apply_1o13.push(endPtVertice3SpV);
    apply_1o13.push(endPtVertice3);
    var apply_1_glob3 = new THREE.BufferGeometry().setFromPoints(apply_1o13);
    var applyline_o1Bglob3 = new THREE.LineSegments(apply_1_glob3, applyline_dash_glob);
    applyline_o1Bglob3.computeLineDistances();//compute
    form_general_global.add(applyline_o1Bglob3);


    if (ForceO1.z < 0) {
        const endPtArrowVertice3 = addVectorAlongDir(formPtO3new, formBtPt3, 0.1);
        const endPtArrowVertice32 = addVectorAlongDir(formPtO3new, formBtPt3, 0.45);
        var apply_Rarrow3 = createCylinderArrowMesh(endPtArrowVertice32, endPtArrowVertice3, arrow_applyGlob, 0.02, 0.05, 0.56);
        form_general_global.add(apply_Rarrow3);
        var apply_Rarrow32 = createCylinderArrowMesh(endPtArrowVertice32, endPtArrowVertice3, arrow_apply_outlineGlob, 0.025, 0.06, 0.56);
        form_general_global.add(apply_Rarrow32);
    } else {
        const endPtArrowVertice3 = addVectorAlongDir(formPtO3new, formBtPt3, 0.1);
        const endPtArrowVertice32 = addVectorAlongDir(formPtO3new, formBtPt3, 0.45);
        var apply_Rarrow3 = createCylinderArrowMesh(endPtArrowVertice3, endPtArrowVertice32, arrow_applyGlob, 0.02, 0.05, 0.56);
        form_general_global.add(apply_Rarrow3);
        var apply_Rarrow32 = createCylinderArrowMesh(endPtArrowVertice3, endPtArrowVertice32, arrow_apply_outlineGlob, 0.025, 0.06, 0.56);
        form_general_global.add(apply_Rarrow32);
    }
    // triangle ADO1 - 3
    var normalADO1_a = subVec(ForceO1, forcePtD);
    var normalADO1_b = subVec(forcePtD, forcePtA);
    var normalADO1 = cross(normalADO1_a, normalADO1_b);
    var edgePtO1O3 = subVec(formPtO1new, formPtO3new);
    var resultPtO1O3 = normalADO1.dot(edgePtO1O3);

    if (resultPtO1O3 < 0) {
        if (areaADO1 / areaMax >= 0.75) {
            formedgeColor4 = 0x0F3150
        }
        if (0.5 <= areaADO1 / areaMax && areaADO1 / areaMax < 0.75) {
            formedgeColor4 = 0x05416D
        }
        if (0.25 <= areaADO1 / areaMax && areaADO1 / areaMax < 0.5) {
            formedgeColor4 = 0x376D9B
        }
        if (0 <= areaADO1 / areaMax && areaADO1 / areaMax < 0.25) {
            formedgeColor4 = 0x5B84AE
        }
        var forceFaceADO1 = ForceFace3pt(forcePtD, forcePtA, ForceO1, formedgeColor4);
    } else {
        if (areaADO1 / areaMax >= 0.75) {
            formedgeColor4 = 0x80002F
        }
        if (0.5 <= areaADO1 / areaMax && areaADO1 / areaMax < 0.75) {
            formedgeColor4 = 0x940041
        }
        if (0.25 <= areaADO1 / areaMax && areaADO1 / areaMax < 0.5) {
            formedgeColor4 = 0xCC0549
        }
        if (0 <= areaADO1 / areaMax && areaADO1 / areaMax < 0.25) {
            formedgeColor4 = 0xD72F62
        }
        var forceFaceADO1 = ForceFace3pt(forcePtD, forcePtA, ForceO1, formedgeColor4);
    }

    var formEdgePtO1O3Material = new THREE.MeshPhongMaterial({
        color: formedgeColor4
    });
    force_group_f.add(forceFaceADO1)
    var forceFaceADO1glob = ForceFace3pt(forcePtD, forcePtA, ForceO1, 0x014F06)
    force_general_global.add(forceFaceADO1glob)

    var edgeSize4 = areaADO1 * 0.02;
    edgeSize4 = THREE.MathUtils.clamp(edgeSize4, 0.01, 0.5);

    //create end sphere for bottom vertice 1
    const endPtVertice4SpV = addVectorAlongDir(formPtO3new, formPtO1new, -0.08);
    addEdgeSphere(edgeSize4, endPtVertice4SpV, formedgeColor4)

    const endPtVertice4SpV2 = addVectorAlongDir(formPtO1new, formPtO3new, -0.08);
    addEdgeSphere(edgeSize4, endPtVertice4SpV2, formedgeColor4)
    //create edge bottom vertice 1
    const endPtVertice4 = addVectorAlongDir(formPtO1new, formPtO3new, -0.08);
    createCylinderMesh(endPtVertice4SpV, endPtVertice4, formEdgePtO1O3Material, edgeSize4, edgeSize4);

    // form_group_e.add(endPtVertice4Sp)
    // form_group_e.add(endPtVertice4Sp2)
    // form_group_e.add(formEdge4)

    // triangle BDO1 - 3
    var normalBDO1_a = subVec(ForceO1, forcePtD);
    var normalBDO1_b = subVec(forcePtD, forcePtB);
    var normalBDO1 = cross(normalBDO1_a, normalBDO1_b);
    var edgePtO1O2 = subVec(formPtO2new, formPtO1new);
    var resultPtO1O2 = normalBDO1.dot(edgePtO1O2);

    if (resultPtO1O2 < 0) {
        if (areaBDO1 / areaMax >= 0.75) {
            formedgeColor5 = 0x0F3150
        }
        if (0.5 <= areaBDO1 / areaMax && areaBDO1 / areaMax < 0.75) {
            formedgeColor5 = 0x05416D
        }
        if (0.25 <= areaBDO1 / areaMax && areaBDO1 / areaMax < 0.5) {
            formedgeColor5 = 0x376D9B
        }
        if (0 <= areaBDO1 / areaMax && areaBDO1 / areaMax < 0.25) {
            formedgeColor5 = 0x5B84AE
        }
        var forceFaceBDO1 = ForceFace3pt(forcePtD, forcePtB, ForceO1, formedgeColor5);
    } else {
        if (areaBDO1 / areaMax >= 0.75) {
            formedgeColor5 = 0x80002F
        }
        if (0.5 <= areaBDO1 / areaMax && areaBDO1 / areaMax < 0.75) {
            formedgeColor5 = 0x940041
        }
        if (0.25 <= areaBDO1 / areaMax && areaBDO1 / areaMax < 0.5) {
            formedgeColor5 = 0xCC0549
        }
        if (0 <= areaBDO1 / areaMax && areaBDO1 / areaMax < 0.25) {
            formedgeColor5 = 0xD72F62
        }
        var forceFaceBDO1 = ForceFace3pt(forcePtD, forcePtB, ForceO1, formedgeColor5);
    }

    var formEdgePtO1O2Material = new THREE.MeshPhongMaterial({
        color: formedgeColor5
    });
    force_group_f.add(forceFaceBDO1)
    // var forceFaceBDO1glob = ForceFace3pt(forcePtA,forcePtB,ForceO1,0x014F06)
    // force_general_global.add(forceFaceBDO1glob)

    var edgeSize5 = areaBDO1 * 0.02;
    edgeSize5 = THREE.MathUtils.clamp(edgeSize5, 0.01, 0.5);

    //create end sphere for bottom vertice 1
    const endPtVertice5SpV = addVectorAlongDir(formPtO2new, formPtO1new, -0.08);
    addEdgeSphere(edgeSize5, endPtVertice5SpV, formedgeColor5)

    const endPtVertice5SpV2 = addVectorAlongDir(formPtO1new, formPtO2new, -0.08);
    addEdgeSphere(edgeSize5, endPtVertice5SpV2, formedgeColor5)
    //create edge bottom vertice 1
    const endPtVertice5 = addVectorAlongDir(formPtO1new, formPtO2new, -0.08);
    createCylinderMesh(endPtVertice5SpV, endPtVertice5, formEdgePtO1O2Material, edgeSize5, edgeSize5);

    // form_group_e.add(endPtVertice5Sp)
    // form_group_e.add(endPtVertice5Sp2)
    // form_group_e.add(formEdge5)

    // triangle CDO1 - 3
    var normalCDO1_a = subVec(ForceO1, forcePtD);
    var normalCDO1_b = subVec(forcePtD, forcePtC);
    var normalCDO1 = cross(normalCDO1_a, normalCDO1_b);
    var edgePtO3O2 = subVec(formPtO3new, formPtO2new);
    var resultPtO3O2 = normalCDO1.dot(edgePtO3O2);

    if (resultPtO3O2 < 0) {
        if (areaCDO1 / areaMax >= 0.75) {
            formedgeColor6 = 0x0F3150
        }
        if (0.5 <= areaCDO1 / areaMax && areaCDO1 / areaMax < 0.75) {
            formedgeColor6 = 0x05416D
        }
        if (0.25 <= areaCDO1 / areaMax && areaCDO1 / areaMax < 0.5) {
            formedgeColor6 = 0x376D9B
        }
        if (0 <= areaCDO1 / areaMax && areaCDO1 / areaMax < 0.25) {
            formedgeColor6 = 0x5B84AE
        }
        var forceFaceCDO1 = ForceFace3pt(forcePtD, forcePtC, ForceO1, formedgeColor6);
    } else {
        if (areaCDO1 / areaMax >= 0.75) {
            formedgeColor6 = 0x80002F
        }
        if (0.5 <= areaCDO1 / areaMax && areaCDO1 / areaMax < 0.75) {
            formedgeColor6 = 0x940041
        }
        if (0.25 <= areaCDO1 / areaMax && areaCDO1 / areaMax < 0.5) {
            formedgeColor6 = 0xCC0549
        }
        if (0 <= areaCDO1 / areaMax && areaCDO1 / areaMax < 0.25) {
            formedgeColor6 = 0xD72F62
        }
        var forceFaceCDO1 = ForceFace3pt(forcePtD, forcePtC, ForceO1, formedgeColor6);
    }

    var formEdgePtO3O2Material = new THREE.MeshPhongMaterial({
        color: formedgeColor6
    });
    force_group_f.add(forceFaceCDO1)

    var edgeSize6 = areaBDO1 * 0.02;
    edgeSize6 = THREE.MathUtils.clamp(edgeSize6, 0.01, 0.5);

    //create end sphere for bottom vertice 1
    const endPtVertice6SpV = addVectorAlongDir(formPtO2new, formPtO3new, -0.08);
    addEdgeSphere(edgeSize6, endPtVertice6SpV, formedgeColor6)

    const endPtVertice6SpV2 = addVectorAlongDir(formPtO3new, formPtO2new, -0.08);
    addEdgeSphere(edgeSize6, endPtVertice6SpV2, formedgeColor6)
    //create edge bottom vertice 1
    const endPtVertice6 = addVectorAlongDir(formPtO3new, formPtO2new, -0.08);
    createCylinderMesh(endPtVertice6SpV, endPtVertice6, formEdgePtO3O2Material, edgeSize6, edgeSize6);

    // form_group_e.add(endPtVertice6Sp)
    // form_group_e.add(endPtVertice6Sp2)
    // form_group_e.add(formEdge6)

    form_group_f.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = faceVisibilityCheckboxParams.face;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = faceVisibilityCheckboxParams.face;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = faceVisibilityCheckboxParams.face;
        }
    });

    form_general_global.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = globalVisibilityCheckboxParams.global;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = globalVisibilityCheckboxParams.global;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = globalVisibilityCheckboxParams.global;
        }
    });
    force_general_global.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = globalVisibilityCheckboxParams.global;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = globalVisibilityCheckboxParams.global;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = globalVisibilityCheckboxParams.global;
        }
    });
    force_group_f.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = !globalVisibilityCheckboxParams.global;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = !globalVisibilityCheckboxParams.global;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = !globalVisibilityCheckboxParams.global;
        }
    });
    form_group_e.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = !globalVisibilityCheckboxParams.global;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = !globalVisibilityCheckboxParams.global;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = !globalVisibilityCheckboxParams.global;
        }
    });

    scene.add(form_group_v);
    scene.add(form_group_f);
    scene.add(form_group_e);
    scene.add(form_group_c);
    scene.add(form_general);
    scene.add(form_general_global);

    scene2.add(force_group_v);
    scene2.add(force_group_f);
    scene2.add(force_group_e);
    scene2.add(force_group_c);
    scene2.add(force_general);
    scene2.add(force_general_global);

    scene2.add(force_group_e_trial);
    scene2.add(force_group_f_trial);
    scene2.add(force_general_trial);


}


function initModel() {
    Redraw();
    trfm_ctrl = new THREE.TransformControls(camera, renderer.domElement);

    trfm_ctrl.addEventListener('change', render);
    trfm_ctrl.addEventListener('objectChange', function () {
        switch (selectObj.name.charAt(2)) {
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
            trfm_ctrl.showX = false;
            trfm_ctrl.showY = false;

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
    renderer.setPixelRatio(devicePixelRatio);
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

//rendering the scenes
function render() {

    let ctrlMin = new THREE.Vector3(-2, -2, -2);
    let ctrlMax = new THREE.Vector3(2, 2, 2);

    if (selectObj != null) {
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
                }
                //document.addEventListener('mousemove', onMouseMove);

                if (event.button === 0 && intersects[0]) {

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
animate();

// *************** support functions *******************
function create_offset_point(point1, point2, point3, scale) {
    var centroid = new THREE.Vector3((point1.x + point2.x + point3.x) / 3, (point1.y + point2.y + point3.y) / 3, (point1.z + point2.z + point3.z) / 3);

    return new THREE.Vector3(centroid.x + (point1.x - centroid.x) * scale, centroid.y + (point1.y - centroid.y) * scale, centroid.z + (point1.z - centroid.z) * scale)
}

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

function addVerticeSup(size, name, location) {
    var pt_material = new THREE.MeshPhongMaterial({color: "black", transparent: false});
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

//***************** construct form edge ***********************
function addEdgeSphere(size, location, color) {
    var pt_material = new THREE.MeshPhongMaterial({color: color, transparent: false});
    var pt_geo = new THREE.SphereGeometry(size);
    var pt_sphere = new THREE.Mesh(pt_geo, pt_material);

    pt_sphere.position.copy(location);
    pt_sphere.castShadow = true;

    return pt_sphere
}

function drawArrowfromVec(startPt, endPt, length) {
    return new THREE.Vector3(startPt.x - length * endPt.x, startPt.y - length * endPt.y, startPt.z - length * endPt.z)
}

//***************** construct faces ***********************
//form faces - green color
function FormFace3ptGN(pt1, pt2, pt3) {

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
        new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 1}),
        new THREE.MeshPhongMaterial({
            color: 0x009600, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false
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
            // depthWrite: false
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

function FormPlane3Pt(pt1, pt2, pt3) {

    let geometry = new THREE.BufferGeometry()
    const points = [
        pt1,
        pt2,
        pt3
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

function ForceTrialFace3Pt(pt1, pt2, pt3, ptO) {

    let geometry = new THREE.BufferGeometry()
    const points = [
        pt1,
        pt2,
        ptO,

        pt2,
        pt3,
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


function createSpriteText(text, text2, pos) {
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
    ctx.fillText(text2, 190, 157);

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

function createSpriteTextApply(text, text2, pos) {
    //canva
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
    ctx.fillText(text2, 200, 157);

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

function createSpriteTextNormal(text, text2, text3, pos) {
    //canva
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
    ctx.fillText(text2, 200, 157);

    ctx.fillStyle = "black";
    ctx.font = "25px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text3, 240, 150);

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

function face_center(n1, n2, n3) {

    var face_centerD = new THREE.Vector3();

    face_centerD.x = (n1.x + n2.x + n3.x) / 3;
    face_centerD.y = (n1.y + n2.y + n3.y) / 3;
    face_centerD.z = (n1.z + n2.z + n3.z) / 3;

    return face_centerD;

}