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

var minkscale = new function () {
    this.l = 0.02
}

//************************************** testing new UI (tweakpane) ************************************

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

// cells
const cellVisibilityCheckboxParams = {
    'cell': false, //at first, box is unchecked so value is "false"
};

// faces - checkbox
tab.pages[0].addInput(cellVisibilityCheckboxParams, 'cell').on('change', () => { //on change, dispose old plane geometry and create new
    redrawCell();
});

/************************* Left Panel second tab *************************/

const minkVisibilityCheckboxParams = {
    'show': false, //at first, box is unchecked so value is "false"
};
const minkVisibilityCheckbox = tab.pages[1].addInput(minkVisibilityCheckboxParams, 'show').on('change', (ev) => { //on change, dispose old plane geometry and create new
    tab.pages[0].children[0].disabled = !tab.pages[0].children[0].disabled;
    tab.pages[0].children[1].disabled = !tab.pages[0].children[1].disabled;
    paneRight.children[0].disabled = !paneRight.children[0].disabled;
    if (ev.value) {
        paneLeft.importPreset(minkPreset);
    }
    redrawMink();
});

const minkParams = {
    length: 0.02,
};
const minkSlider = tab.pages[1].addInput(minkParams, 'length', {
    min: 0.01,
    max: 0.95,
    step: 0.001
}).on('change', (ev) => { //on change, dispose old geometry and create new
    minkscale.l = ev.value;
    redrawMink();
});
minkSlider.hidden = true;
minkVisibilityCheckbox.on('change', () => { //on change, change the hidden and visibility values set
    minkSlider.hidden = !minkSlider.hidden;
});

const minkPreset = paneLeft.exportPreset();
minkPreset.show = true;
const disableLeftPane = paneLeft.exportPreset();

paneLeft.refresh();

/************************* Right Panel *************************/

const paneRight = new Tweakpane.Pane({
    container: document.getElementById('right_container'),
});

const stepVisibilityCheckboxParams = {
    'steps': false, //at first, box is unchecked so value is "false"
};

const stepSliderParams = {
    size: 1, //starts as double the size of the box's params
};
//make the checkbox
const stepVisibilityCheckbox = paneRight.addInput(stepVisibilityCheckboxParams, 'steps').on('change', (ev) => { //on change, dispose old plane geometry and create new
    tab.pages[0].children[0].disabled = !tab.pages[0].children[0].disabled;
    tab.pages[0].children[1].disabled = !tab.pages[0].children[1].disabled;
    tab.pages[1].children[0].disabled = !tab.pages[1].children[0].disabled;
    if (ev.value) {
        paneRight.importPreset(resetSizeTo1On);
        paneLeft.importPreset(disableLeftPane);
    } else {
        paneRight.importPreset(resetSizeTo1Off);
    }
    redrawStep();
});

//make the plane size slider
const stepSlider = paneRight.addInput(stepSliderParams, 'size', {
    min: 1, //min = double the size of the box's params
    max: 6, //max = quadruple the size of the box's params
    step: 1
}).on('change', (ev) => { //on change, dispose old plane geometry and create new
    forceCellScale = ev.value;
    Redraw();
    switch (ev.value) {
        case 1:
            break;
        case 2:
            break;
        case 3:
            form_group_step_3.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
                if (obj.type === "LineSegments") {
                    obj.material.visible = true;
                }
            });
            force_group_step_3.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
                if (obj.type === "LineSegments") {
                    obj.material.visible = true;
                }
            });
            break;
        case 4:
            form_group_step_4.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
                if (obj.type === "LineSegments") {
                    obj.material.visible = true;
                }
            });
            form_group_step_3.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
                if (obj.type === "LineSegments") {
                    obj.material.visible = true;
                }
            });
            force_group_step_4.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
                if (obj.type === "LineSegments") {
                    obj.material.visible = true;
                }
            });
            force_group_step_3.traverse(function (obj) {
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });
            break;
        case 5:
            form_group_step_5.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
                if (obj.type === "LineSegments") {
                    obj.material.visible = true;
                }
            });
            force_group_step_5.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
                if (obj.type === "LineSegments") {
                    obj.material.visible = true;
                }
            });
            force_group_step_3.traverse(function (obj) {
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });
            force_group_step_4.traverse(function (obj) {
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });
            break;
        case 6:
            force_group_step_5.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
                if (obj.type === "LineSegments") {
                    obj.material.visible = true;
                }
            });
            form_group_step_6.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
                if (obj.type === "LineSegments") {
                    obj.material.visible = true;
                }
            });
            force_group_step_6.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
                if (obj.type === "LineSegments") {
                    obj.material.visible = true;
                }
            });
            force_group_step_3.traverse(function (obj) {
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });
            force_group_step_4.traverse(function (obj) {
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });
            break;
        default:
            console.log("steps slider failed");
    }
});
stepSlider.hidden = true;

stepVisibilityCheckbox.on('change', () => { //on change, change the hidden and visibility values set
    stepSlider.hidden = !stepSlider.hidden;
});

const resetSizeTo1On = paneRight.exportPreset();
resetSizeTo1On.steps = true;
const resetSizeTo1Off = paneRight.exportPreset();

var forceCellScale = 0.7


// *********************** form diagram initial data ***********************

var formTpPt = [];
formTpPt.push(new THREE.Vector3(0, 0, 0));
formTpPt.push(new THREE.Vector3(0, 0, 1));

var formBtPt1 = [];
formBtPt1.push(new THREE.Vector3(0, 0, 0));
formBtPt1.push(new THREE.Vector3(1, -1, -1));

var formBtPt2 = [];
formBtPt2.push(new THREE.Vector3(0, 0, 0));
formBtPt2.push(new THREE.Vector3(-1.3660, -0.3660, -1));

var formBtPt3 = [];
formBtPt3.push(new THREE.Vector3(0, 0, 0));
formBtPt3.push(new THREE.Vector3(0.3660, 1.3660, -1));

var Ctrl_pts = new Array(3);

var form_general

var form_group_v
var form_group_f
var form_group_e
var form_group_c

var form_group_mink
var form_group_step
var form_group_step_3
var form_group_step_4
var form_group_step_5
var form_group_step_6
var form_group_step_7

// *********************** force diagram initial data ***********************

var force_group_f
var force_group_e
var force_group_c
var force_general

var force_group_mink

var force_group_step
var force_group_step_3
var force_group_step_4
var force_group_step_5
var force_group_step_6
var force_group_step_7

function redrawFace() {
    scene.remove(form_group_f);
    form_group_f = new THREE.Group();

    // *********************** form faces **************************

    //face 1, 2, 3 - green color
    const formFace_1 = FormFace3ptGN(formTpPt[0], formTpPt[1], formBtPt1[1]);
    const formFace_2 = FormFace3ptGN(formTpPt[0], formTpPt[1], formBtPt2[1]);
    const formFace_3 = FormFace3ptGN(formTpPt[0], formTpPt[1], formBtPt3[1]);

    //face 4, 5, 6 - grey color
    const formFace_4 = FormFace3ptGR(formTpPt[0], formBtPt1[1], formBtPt2[1]);
    const formFace_5 = FormFace3ptGR(formTpPt[0], formBtPt2[1], formBtPt3[1]);
    const formFace_6 = FormFace3ptGR(formTpPt[0], formBtPt3[1], formBtPt1[1]);

    form_group_f.add(formFace_1);
    form_group_f.add(formFace_2);
    form_group_f.add(formFace_3);

    form_group_f.add(formFace_4);
    form_group_f.add(formFace_5);
    form_group_f.add(formFace_6);

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

    scene.add(form_group_f);
}

function redrawStep() {
    form_group_e.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = !stepVisibilityCheckboxParams.steps;
        }
    });
    force_group_e.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = !stepVisibilityCheckboxParams.steps;
        }
    });
    force_group_f.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = !stepVisibilityCheckboxParams.steps;
        }
    });
    force_general.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = !stepVisibilityCheckboxParams.steps;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = !stepVisibilityCheckboxParams.steps;
        }
        if (obj.type === "Line") {
            obj.material.visible = !stepVisibilityCheckboxParams.steps;
        }
    });
    form_group_step.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = stepVisibilityCheckboxParams.steps;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = stepVisibilityCheckboxParams.steps;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = stepVisibilityCheckboxParams.steps;
        }
        if (obj.type === "Line") {
            obj.material.visible = stepVisibilityCheckboxParams.steps;
        }
    });
}

function redrawCell() {
    scene.remove(form_group_c);
    form_group_c = new THREE.Group();

    // *********************** form cells **************************
    const formCell1 = addCell3Face(formTpPt[0], formTpPt[1], formBtPt1[1], formBtPt2[1], 0.8)
    form_group_c.add(formCell1);

    const formCell2 = addCell3Face(formTpPt[0], formTpPt[1], formBtPt2[1], formBtPt3[1], 0.8)
    form_group_c.add(formCell2);

    const formCell3 = addCell3Face(formTpPt[0], formTpPt[1], formBtPt1[1], formBtPt3[1], 0.8)
    form_group_c.add(formCell3);

    const formCell4 = addCell3Face(formTpPt[0], formBtPt1[1], formBtPt2[1], formBtPt3[1], 0.8)
    form_group_c.add(formCell4);

    var formCell_textA = createSpriteText('A', "", face_center(formTpPt[1], formBtPt1[1], formBtPt3[1]))
    form_group_c.add(formCell_textA);

    var formCell_textB = createSpriteText('B', "", face_center(formTpPt[1], formBtPt1[1], formBtPt2[1]))
    form_group_c.add(formCell_textB);

    var formCell_textC = createSpriteText('C', "", face_center(formTpPt[1], formBtPt2[1], formBtPt3[1]))
    form_group_c.add(formCell_textC);

    var formCell_textD = createSpriteText('D', "", face_center(formBtPt1[1], formBtPt2[1], formBtPt3[1]))
    form_group_c.add(formCell_textD);

    form_group_c.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = cellVisibilityCheckboxParams.cell || stepSliderParams.size == 2;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = cellVisibilityCheckboxParams.cell || stepSliderParams.size == 2;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = cellVisibilityCheckboxParams.cell || stepSliderParams.size == 2;
        }
    });

    scene.add(form_group_c);
}

function redrawMink() {
    scene.remove(form_group_mink);
    form_group_mink = new THREE.Group();
    scene2.remove(force_group_mink);
    force_group_mink = new THREE.Group();

    // *********************** force points ***********************
    var edgescale = 2; // size of the force diagram

    //PtA and PtB
    var forcePtA = new THREE.Vector3(1, 0.2, 0)

    var forcePtBtemp = CalNormalVectorUpdated(formBtPt1[1], formTpPt[1], formTpPt[0], edgescale);
    var forcePtB = new THREE.Vector3(forcePtA.x - forcePtBtemp.x, forcePtA.y - forcePtBtemp.y, forcePtA.z - forcePtBtemp.z);

    //PtC

    var forcePtC1temp = CalNormalVectorUpdated(formBtPt2[1], formTpPt[1], formTpPt[0], edgescale);
    var forcePtC1 = new THREE.Vector3(forcePtB.x - forcePtC1temp.x, forcePtB.y - forcePtC1temp.y, forcePtB.z - forcePtC1temp.z);

    var forcePtC2temp = CalNormalVectorUpdated(formBtPt3[1], formTpPt[1], formTpPt[0], edgescale);
    var forcePtC2 = new THREE.Vector3(forcePtA.x - forcePtC2temp.x, forcePtA.y - forcePtC2temp.y, forcePtA.z - forcePtC2temp.z);

    var dirBC = new THREE.Vector3(); // create once an reuse it

    dirBC.subVectors(forcePtB, forcePtC1).normalize();

    var dirAC = new THREE.Vector3(); // create once an reuse it

    dirAC.subVectors(forcePtC2, forcePtA).normalize();
    var forcePtC = LinesSectPt(dirBC, forcePtB, dirAC, forcePtA);

    // *********************** calculating the normals for apply loads ***********************
    // triangle ABC
    var normalABC_a = subVec(forcePtA, forcePtB)
    var normalABC_b = subVec(forcePtB, forcePtC)
    var normalABC = cross(normalABC_a, normalABC_b)

    var edgeVector0 = subVec(formTpPt[0], formTpPt[1]);
    var resultapply = normalABC.dot(edgeVector0)

    // redefine the force points PtB, PtC ( one condition is that the force diagram flipped)
    if (resultapply < 0) {
        var lenAC = forcePtA.distanceTo(forcePtC);
        var forcePtBnew = addVectorAlongDir(forcePtC, forcePtA, lenAC)

        var lenAB = forcePtA.distanceTo(forcePtB);
        forcePtC = addVectorAlongDir(forcePtB, forcePtA, lenAB)
        forcePtB = forcePtBnew
    }

    // redefine the force point PtD ( one condition is that the force diagram flipped)

    //PtD

    if (resultapply > 0) {
        var forcePtD1temp = CalNormalVectorUpdated(formBtPt1[1], formTpPt[0], formBtPt3[1], edgescale);
        var forcePtD1 = new THREE.Vector3(forcePtA.x - forcePtD1temp.x, forcePtA.y - forcePtD1temp.y, forcePtA.z - forcePtD1temp.z);

        var forcePtD2temp = CalNormalVectorUpdated(formBtPt2[1], formTpPt[0], formBtPt1[1], edgescale);
        var forcePtD2 = new THREE.Vector3(forcePtB.x - forcePtD2temp.x, forcePtB.y - forcePtD2temp.y, forcePtB.z - forcePtD2temp.z);

        var dirAD = new THREE.Vector3(); // create once an reuse it

        dirAD.subVectors(forcePtA, forcePtD1).normalize();

        var dirBD = new THREE.Vector3(); // create once an reuse it

        dirBD.subVectors(forcePtD2, forcePtB).normalize();
        var forcePtD = LinesSectPt(dirAD, forcePtA, dirBD, forcePtB);
    } else {
        var forcePtD1temp = CalNormalVectorUpdated(formBtPt1[1], formTpPt[0], formBtPt3[1], edgescale);
        var forcePtD1 = new THREE.Vector3(forcePtA.x - forcePtD1temp.x, forcePtA.y - forcePtD1temp.y, forcePtA.z - forcePtD1temp.z);

        var forcePtD2temp = CalNormalVectorUpdated(formBtPt3[1], formTpPt[0], formBtPt2[1], edgescale);
        var forcePtD2 = new THREE.Vector3(forcePtB.x - forcePtD2temp.x, forcePtB.y - forcePtD2temp.y, forcePtB.z - forcePtD2temp.z);

        var dirAD = new THREE.Vector3(); // create once an reuse it

        dirAD.subVectors(forcePtA, forcePtD1).normalize();

        var dirBD = new THREE.Vector3(); // create once an reuse it

        dirBD.subVectors(forcePtD2, forcePtB).normalize();
        var forcePtD = LinesSectPt(dirAD, forcePtA, dirBD, forcePtB);
    }

    // *********************** calculating the areas of triangles (from the four points) ***********************

    var areaABD = create_force_face_area(forcePtA, forcePtB, forcePtD);
    var areaBCD = create_force_face_area(forcePtB, forcePtC, forcePtD);
    var areaACD = create_force_face_area(forcePtA, forcePtC, forcePtD);

    var areaMax = Math.max(areaABD, areaBCD, areaACD);

    // *********************** calculating the normals for each triangle ***********************

    // ****** calculating normals *******
    // A = p2 - p1, B = p3 - p1
    // Nx = Ay * Bz - Az * By
    // Ny = Az * Bx - Ax * Bz
    // Nz = Ax * By - Ay * Bx
    // ******

    // triangle ABD
    var normalABD_a = subVec(forcePtB, forcePtA)
    var normalABD_b = subVec(forcePtA, forcePtD)
    var normalABD = cross(normalABD_a, normalABD_b)

    var edgeVector1 = subVec(formTpPt[0], formBtPt1[1]);

    // triangle BCD
    var normalBCD_a = subVec(forcePtC, forcePtB)
    var normalBCD_b = subVec(forcePtB, forcePtD)
    var normalBCD = cross(normalBCD_a, normalBCD_b)

    var edgeVector2 = subVec(formTpPt[0], formBtPt2[1]);

    // triangle ACD
    var normalCAD_a = subVec(forcePtA, forcePtC)
    var normalCAD_b = subVec(forcePtC, forcePtD)
    var normalCAD = cross(normalCAD_a, normalCAD_b)

    var edgeVector3 = subVec(formTpPt[0], formBtPt3[1]);

    // ********************************** Minkowski Sum Generation ************************************

    //Minkowski Test
    var formMSedgeMaterial = new THREE.MeshPhongMaterial({
        color: "lightgrey"
    });

    var minkedgeSize = 0.005
    // chose the start point - formPtO1new (z - 0.5)
    var minkStPt = formTpPt[0]
    var forceCenterPt = new THREE.Vector3(
        (forcePtA.x + forcePtB.x + forcePtC.x + forcePtD.x) / 4,
        (forcePtA.y + forcePtB.y + forcePtC.y + forcePtD.y) / 4,
        (forcePtA.z + forcePtB.z + forcePtC.z + forcePtD.z) / 4
    )

    var formMSline1 = createdashline(formBtPt1[1], formTpPt[0], "grey")
    form_group_mink.add(formMSline1)
    var formMSline2 = createdashline(formBtPt2[1], formTpPt[0], "grey")
    form_group_mink.add(formMSline2)
    var formMSline3 = createdashline(formBtPt3[1], formTpPt[0], "grey")
    form_group_mink.add(formMSline3)

    // 1 - force cell ABCO1
    var formMSedgetempA = subVecUpdated(forcePtA, forceCenterPt)
    var formMSptA = new THREE.Vector3(
        minkStPt.x - minkscale.l * formMSedgetempA.x,
        minkStPt.y - minkscale.l * formMSedgetempA.y,
        minkStPt.z - minkscale.l * formMSedgetempA.z
    );

    var formMSedgetempB = subVecUpdated(forcePtB, forceCenterPt)
    var formMSptB = new THREE.Vector3(
        minkStPt.x - minkscale.l * formMSedgetempB.x,
        minkStPt.y - minkscale.l * formMSedgetempB.y,
        minkStPt.z - minkscale.l * formMSedgetempB.z
    );

    var formMSedgetempC = subVecUpdated(forcePtC, forceCenterPt)
    var formMSptC = new THREE.Vector3(
        minkStPt.x - minkscale.l * formMSedgetempC.x,
        minkStPt.y - minkscale.l * formMSedgetempC.y,
        minkStPt.z - minkscale.l * formMSedgetempC.z
    );

    var formMSedgetempD = subVecUpdated(forcePtD, forceCenterPt)
    var formMSptD = new THREE.Vector3(
        minkStPt.x - minkscale.l * formMSedgetempD.x,
        minkStPt.y - minkscale.l * formMSedgetempD.y,
        minkStPt.z - minkscale.l * formMSedgetempD.z
    );

    const formMSedgeAB = createCylinderMesh(formMSptA, formMSptB, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAB)
    const formMSedgeAC = createCylinderMesh(formMSptA, formMSptC, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAC)
    const formMSedgeBC = createCylinderMesh(formMSptC, formMSptB, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBC)

    const formMSedgeBD = createCylinderMesh(formMSptB, formMSptD, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBD)
    const formMSedgeAD = createCylinderMesh(formMSptA, formMSptD, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAD)
    const formMSedgeCD = createCylinderMesh(formMSptC, formMSptD, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeCD)

    //construct minkowski cell in the force diagram
    var formMSptARef = new THREE.Vector3(
        minkStPt.x - 0.95 * formMSedgetempA.x,
        minkStPt.y - 0.95 * formMSedgetempA.y,
        minkStPt.z - 0.95 * formMSedgetempA.z
    );

    var formMSptBRef = new THREE.Vector3(
        minkStPt.x - 0.95 * formMSedgetempB.x,
        minkStPt.y - 0.95 * formMSedgetempB.y,
        minkStPt.z - 0.95 * formMSedgetempB.z
    );

    var formMSptCRef = new THREE.Vector3(
        minkStPt.x - 0.95 * formMSedgetempC.x,
        minkStPt.y - 0.95 * formMSedgetempC.y,
        minkStPt.z - 0.95 * formMSedgetempC.z
    );

    var formMSptDRef = new THREE.Vector3(
        minkStPt.x - 0.95 * formMSedgetempD.x,
        minkStPt.y - 0.95 * formMSedgetempD.y,
        minkStPt.z - 0.95 * formMSedgetempD.z
    );

    var forceMSedgetempA = subVecUpdated(formMSptARef, minkStPt)
    var forceMSptA = new THREE.Vector3(
        forceCenterPt.x - (0.95 - minkscale.l) * forceMSedgetempA.x,
        forceCenterPt.y - (0.95 - minkscale.l) * forceMSedgetempA.y,
        forceCenterPt.z - (0.95 - minkscale.l) * forceMSedgetempA.z
    );
    var forceMSedgetempB = subVecUpdated(formMSptBRef, minkStPt)
    var forceMSptB = new THREE.Vector3(
        forceCenterPt.x - (0.95 - minkscale.l) * forceMSedgetempB.x,
        forceCenterPt.y - (0.95 - minkscale.l) * forceMSedgetempB.y,
        forceCenterPt.z - (0.95 - minkscale.l) * forceMSedgetempB.z
    );
    var forceMSedgetempC = subVecUpdated(formMSptCRef, minkStPt)
    var forceMSptC = new THREE.Vector3(
        forceCenterPt.x - (0.95 - minkscale.l) * forceMSedgetempC.x,
        forceCenterPt.y - (0.95 - minkscale.l) * forceMSedgetempC.y,
        forceCenterPt.z - (0.95 - minkscale.l) * forceMSedgetempC.z
    );
    var forceMSedgetempD = subVecUpdated(formMSptDRef, minkStPt)
    var forceMSptD = new THREE.Vector3(
        forceCenterPt.x - (0.95 - minkscale.l) * forceMSedgetempD.x,
        forceCenterPt.y - (0.95 - minkscale.l) * forceMSedgetempD.y,
        forceCenterPt.z - (0.95 - minkscale.l) * forceMSedgetempD.z
    );

    const forceMSedgeAB = createCylinderMesh(forceMSptA, forceMSptB, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAB)
    const forceMSedgeAC = createCylinderMesh(forceMSptA, forceMSptC, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAC)
    const forceMSedgeBC = createCylinderMesh(forceMSptB, forceMSptC, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeBC)

    const forceMSedgeAD = createCylinderMesh(forceMSptA, forceMSptD, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeAD)
    const forceMSedgeBD = createCylinderMesh(forceMSptB, forceMSptD, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeBD)
    const forceMSedgeCD = createCylinderMesh(forceMSptC, forceMSptD, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCD)

    //project the mink in the force side
    function drawMinkForceExpandEdge(startPt, scale, dirVec1, dirVec2, formMSedgeMaterial, minkedgeSize) {
        var directionVec = subVecUpdated(dirVec1, dirVec2);
        var endPt = new THREE.Vector3(
            startPt.x + (scale) * directionVec.x,
            startPt.y + (scale) * directionVec.y,
            startPt.z + (scale) * directionVec.z
        );
        return createCylinderMesh(startPt, endPt, formMSedgeMaterial, minkedgeSize, minkedgeSize)
    }

    function drawMinkForceExpandPt(startPt, scale, dirVec1, dirVec2) {
        var directionVec = subVecUpdated(dirVec1, dirVec2);
        return new THREE.Vector3(
            startPt.x + (scale) * directionVec.x,
            startPt.y + (scale) * directionVec.y,
            startPt.z + (scale) * directionVec.z
        )
    }

    const forceMSedgeBO1_Pt1O1 = drawMinkForceExpandEdge(
        forceMSptB, minkscale.l, formTpPt[0], formBtPt1[1], formMSedgeMaterial, minkedgeSize);
    force_group_mink.add(forceMSedgeBO1_Pt1O1)

    const forceMSedgeAO1_Pt1O1 = drawMinkForceExpandEdge(
        forceMSptA, minkscale.l, formTpPt[0], formBtPt1[1], formMSedgeMaterial, minkedgeSize);
    force_group_mink.add(forceMSedgeAO1_Pt1O1)

    const forceMSedgeDO1_Pt1O1 = drawMinkForceExpandEdge(
        forceMSptD, minkscale.l, formTpPt[0], formBtPt1[1], formMSedgeMaterial, minkedgeSize);
    force_group_mink.add(forceMSedgeDO1_Pt1O1)

    var forceMSedgeAend_Pt1O1 = drawMinkForceExpandPt(forceMSptA, minkscale.l, formTpPt[0], formBtPt1[1])
    var forceMSedgeBend_Pt1O1 = drawMinkForceExpandPt(forceMSptB, minkscale.l, formTpPt[0], formBtPt1[1])
    var forceMSedgeDend_Pt1O1 = drawMinkForceExpandPt(forceMSptD, minkscale.l, formTpPt[0], formBtPt1[1])

    const forceMSedgeABend_Pt1O1 = createCylinderMesh(forceMSedgeAend_Pt1O1, forceMSedgeBend_Pt1O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeABend_Pt1O1)
    const forceMSedgeADend_Pt1O1 = createCylinderMesh(forceMSedgeAend_Pt1O1, forceMSedgeDend_Pt1O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeADend_Pt1O1)
    const forceMSedgeBDend_Pt1O1 = createCylinderMesh(forceMSedgeBend_Pt1O1, forceMSedgeDend_Pt1O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeBDend_Pt1O1)

    //o to Btpt2
    const forceMSedgeBO1_Pt2O1 = drawMinkForceExpandEdge(
        forceMSptB, minkscale.l, formTpPt[0], formBtPt2[1], formMSedgeMaterial, minkedgeSize);
    force_group_mink.add(forceMSedgeBO1_Pt2O1)

    const forceMSedgeCO1_Pt2O1 = drawMinkForceExpandEdge(
        forceMSptC, minkscale.l, formTpPt[0], formBtPt2[1], formMSedgeMaterial, minkedgeSize);
    force_group_mink.add(forceMSedgeCO1_Pt2O1)

    const forceMSedgeDO1_Pt2O1 = drawMinkForceExpandEdge(
        forceMSptD, minkscale.l, formTpPt[0], formBtPt2[1], formMSedgeMaterial, minkedgeSize);
    force_group_mink.add(forceMSedgeDO1_Pt2O1)

    var forceMSedgeCend_Pt2O1 = drawMinkForceExpandPt(forceMSptC, minkscale.l, formTpPt[0], formBtPt2[1])
    var forceMSedgeBend_Pt2O1 = drawMinkForceExpandPt(forceMSptB, minkscale.l, formTpPt[0], formBtPt2[1])
    var forceMSedgeDend_Pt2O1 = drawMinkForceExpandPt(forceMSptD, minkscale.l, formTpPt[0], formBtPt2[1])

    const forceMSedgeCBend_Pt2O1 = createCylinderMesh(forceMSedgeCend_Pt2O1, forceMSedgeBend_Pt2O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCBend_Pt2O1)
    const forceMSedgeCDend_Pt2O1 = createCylinderMesh(forceMSedgeCend_Pt2O1, forceMSedgeDend_Pt2O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCDend_Pt2O1)
    const forceMSedgeBDend_Pt2O1 = createCylinderMesh(forceMSedgeBend_Pt2O1, forceMSedgeDend_Pt2O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeBDend_Pt2O1)

    //o to Btpt3
    const forceMSedgeAO1_Pt3O1 = drawMinkForceExpandEdge(
        forceMSptA, minkscale.l, formTpPt[0], formBtPt3[1], formMSedgeMaterial, minkedgeSize);
    force_group_mink.add(forceMSedgeAO1_Pt3O1)

    const forceMSedgeCO1_Pt3O1 = drawMinkForceExpandEdge(
        forceMSptC, minkscale.l, formTpPt[0], formBtPt3[1], formMSedgeMaterial, minkedgeSize);
    force_group_mink.add(forceMSedgeCO1_Pt3O1)

    const forceMSedgeDO1_Pt3O1 = drawMinkForceExpandEdge(
        forceMSptD, minkscale.l, formTpPt[0], formBtPt3[1], formMSedgeMaterial, minkedgeSize);
    force_group_mink.add(forceMSedgeDO1_Pt3O1)

    var forceMSedgeCend_Pt3O1 = drawMinkForceExpandPt(forceMSptC, minkscale.l, formTpPt[0], formBtPt3[1])
    var forceMSedgeAend_Pt3O1 = drawMinkForceExpandPt(forceMSptA, minkscale.l, formTpPt[0], formBtPt3[1])
    var forceMSedgeDend_Pt3O1 = drawMinkForceExpandPt(forceMSptD, minkscale.l, formTpPt[0], formBtPt3[1])

    const forceMSedgeCAend_Pt3O1 = createCylinderMesh(forceMSedgeCend_Pt3O1, forceMSedgeAend_Pt3O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCAend_Pt3O1)
    const forceMSedgeCDend_Pt3O1 = createCylinderMesh(forceMSedgeCend_Pt3O1, forceMSedgeDend_Pt3O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeCDend_Pt3O1)
    const forceMSedgeADend_Pt3O1 = createCylinderMesh(forceMSedgeAend_Pt3O1, forceMSedgeDend_Pt3O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    force_group_mink.add(forceMSedgeADend_Pt3O1)


    // 1.1 - project to formBtPt1
    // a. from formMSptBO1 (0.8 is the max number of minkscale.l)
    var formMSptPt1O1temp = subVecUpdated(formTpPt[0], formBtPt1[1]);
    var formMSptBO1_Pt1O1 = new THREE.Vector3(
        formMSptB.x + (0.95 - minkscale.l) * formMSptPt1O1temp.x,
        formMSptB.y + (0.95 - minkscale.l) * formMSptPt1O1temp.y,
        formMSptB.z + (0.95 - minkscale.l) * formMSptPt1O1temp.z
    );
    const formMSedgeBO1_Pt1O1 = createCylinderMesh(formMSptB, formMSptBO1_Pt1O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBO1_Pt1O1)

    var formMSptAO1_Pt1O1 = new THREE.Vector3(
        formMSptA.x + (0.95 - minkscale.l) * formMSptPt1O1temp.x,
        formMSptA.y + (0.95 - minkscale.l) * formMSptPt1O1temp.y,
        formMSptA.z + (0.95 - minkscale.l) * formMSptPt1O1temp.z
    );
    const formMSedgeAO1_Pt1O1 = createCylinderMesh(formMSptA, formMSptAO1_Pt1O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAO1_Pt1O1)

    var formMSptDO1_Pt1O1 = new THREE.Vector3(
        formMSptD.x + (0.95 - minkscale.l) * formMSptPt1O1temp.x,
        formMSptD.y + (0.95 - minkscale.l) * formMSptPt1O1temp.y,
        formMSptD.z + (0.95 - minkscale.l) * formMSptPt1O1temp.z
    );
    const formMSedgeDO1_Pt1O1 = createCylinderMesh(formMSptD, formMSptDO1_Pt1O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeDO1_Pt1O1)

    // *********************** form edges **************************
    var formedgeColor1, formedgeColor2, formedgeColor3

    // condition 1
    if (result1 < 0) {
        if (resultapply > 0) {
            if (areaABD / areaMax >= 0.75) {
                formedgeColor1 = 0x80002F
            }
            if (0.5 <= areaABD / areaMax && areaABD / areaMax < 0.75) {
                formedgeColor1 = 0x940041
            }
            if (0.25 <= areaABD / areaMax && areaABD / areaMax < 0.5) {
                formedgeColor1 = 0xCC0549
            }
            if (0 <= areaABD / areaMax && areaABD / areaMax < 0.25) {
                formedgeColor1 = 0xD72F62
            }
        } else {
            if (areaACD / areaMax >= 0.75) {
                formedgeColor1 = 0x80002F
            }
            if (0.5 <= areaACD / areaMax && areaACD / areaMax < 0.75) {
                formedgeColor1 = 0x940041
            }
            if (0.25 <= areaACD / areaMax && areaACD / areaMax < 0.5) {
                formedgeColor1 = 0xCC0549
            }
            if (0 <= areaACD / areaMax && areaACD / areaMax < 0.25) {
                formedgeColor1 = 0xD72F62
            }
        }
    } else {
        if (resultapply > 0) {
            if (areaABD / areaMax >= 0.75) {
                formedgeColor1 = 0x0F3150
            }
            if (0.5 <= areaABD / areaMax && areaABD / areaMax < 0.75) {
                formedgeColor1 = 0x05416D
            }
            if (0.25 <= areaABD / areaMax && areaABD / areaMax < 0.5) {
                formedgeColor1 = 0x376D9B
            }
            if (0 <= areaABD / areaMax && areaABD / areaMax < 0.25) {
                formedgeColor1 = 0x5B84AE
            }
        } else {
            if (areaACD / areaMax >= 0.75) {
                formedgeColor1 = 0x0F3150
            }
            if (0.5 <= areaACD / areaMax && areaACD / areaMax < 0.75) {
                formedgeColor1 = 0x05416D
            }
            if (0.25 <= areaACD / areaMax && areaACD / areaMax < 0.5) {
                formedgeColor1 = 0x376D9B
            }
            if (0 <= areaACD / areaMax && areaACD / areaMax < 0.25) {
                formedgeColor1 = 0x5B84AE
            }
        }
    }

    if (result2 < 0) {
        if (resultapply > 0) {
            if (areaBCD / areaMax >= 0.75) {
                formedgeColor2 = 0x80002F
            }
            if (0.5 <= areaBCD / areaMax && areaBCD / areaMax < 0.75) {
                formedgeColor2 = 0x940041
            }
            if (0.25 <= areaBCD / areaMax && areaBCD / areaMax < 0.5) {
                formedgeColor2 = 0xCC0549
            }
            if (0 <= areaBCD / areaMax && areaBCD / areaMax < 0.25) {
                formedgeColor2 = 0xD72F62
            }
        } else {
            if (areaBCD / areaMax >= 0.75) {
                formedgeColor2 = 0x80002F
            }
            if (0.5 <= areaBCD / areaMax && areaBCD / areaMax < 0.75) {
                formedgeColor2 = 0x940041
            }
            if (0.25 <= areaBCD / areaMax && areaBCD / areaMax < 0.5) {
                formedgeColor2 = 0xCC0549
            }
            if (0 <= areaBCD / areaMax && areaBCD / areaMax < 0.25) {
                formedgeColor2 = 0xD72F62
            }
        }
    } else {
        if (resultapply > 0) {
            if (areaBCD / areaMax >= 0.75) {
                formedgeColor2 = 0x0F3150
            }
            if (0.5 <= areaBCD / areaMax && areaBCD / areaMax < 0.75) {
                formedgeColor2 = 0x05416D
            }
            if (0.25 <= areaBCD / areaMax && areaBCD / areaMax < 0.5) {
                formedgeColor2 = 0x376D9B
            }
            if (0 <= areaBCD / areaMax && areaBCD / areaMax < 0.25) {
                formedgeColor2 = 0x5B84AE
            }

        } else {
            if (areaBCD / areaMax >= 0.75) {
                formedgeColor2 = 0x0F3150
            }
            if (0.5 <= areaBCD / areaMax && areaBCD / areaMax < 0.75) {
                formedgeColor2 = 0x05416D
            }
            if (0.25 <= areaBCD / areaMax && areaBCD / areaMax < 0.5) {
                formedgeColor2 = 0x376D9B
            }
            if (0 <= areaBCD / areaMax && areaBCD / areaMax < 0.25) {
                formedgeColor2 = 0x5B84AE
            }
        }
    }

    if (result3 < 0) {
        if (resultapply > 0) {
            if (areaACD / areaMax >= 0.75) {
                formedgeColor3 = 0x80002F
            }
            if (0.5 <= areaACD / areaMax && areaACD / areaMax < 0.75) {
                formedgeColor3 = 0x940041
            }
            if (0.25 <= areaACD / areaMax && areaACD / areaMax < 0.5) {
                formedgeColor3 = 0xCC0549
            }
            if (0 <= areaACD / areaMax & areaACD / areaMax < 0.25) {
                formedgeColor3 = 0xD72F62
            }
        } else {
            if (areaABD / areaMax >= 0.75) {
                formedgeColor3 = 0x80002F
            }
            if (0.5 <= areaABD / areaMax && areaABD / areaMax < 0.75) {
                formedgeColor3 = 0x940041
            }
            if (0.25 <= areaABD / areaMax && areaABD / areaMax < 0.5) {
                formedgeColor3 = 0xCC0549
            }
            if (0 <= areaABD / areaMax && areaABD / areaMax < 0.25) {
                formedgeColor3 = 0xD72F62
            }
        }

    } else {
        if (resultapply > 0) {
            if (areaACD / areaMax >= 0.75) {
                formedgeColor3 = 0x0F3150
            }
            if (0.5 <= areaACD / areaMax && areaACD / areaMax < 0.75) {
                formedgeColor3 = 0x05416D
            }
            if (0.25 <= areaACD / areaMax && areaACD / areaMax < 0.5) {
                formedgeColor3 = 0x376D9B
            }
            if (0 <= areaACD / areaMax && areaACD / areaMax < 0.25) {
                formedgeColor3 = 0x5B84AE
            }
        } else {
            if (areaABD / areaMax >= 0.75) {
                formedgeColor3 = 0x0F3150
            }
            if (0.5 <= areaABD / areaMax && areaABD / areaMax < 0.75) {
                formedgeColor3 = 0x05416D
            }
            if (0.25 <= areaABD / areaMax && areaABD / areaMax < 0.5) {
                formedgeColor3 = 0x376D9B
            }
            if (0 <= areaABD / areaMax && areaABD / areaMax < 0.25) {
                formedgeColor3 = 0x5B84AE
            }
        }
    }

    //minkowski faces
    //a. edge 1 - 0
    const formMinkFacePt1Oa = minkFace4pt(formMSptBO1_Pt1O1, formMSptB, formMSptA, formMSptAO1_Pt1O1, formedgeColor1)
    form_group_mink.add(formMinkFacePt1Oa)
    const formMinkFacePt1Ob = minkFace4pt(formMSptAO1_Pt1O1, formMSptA, formMSptD, formMSptDO1_Pt1O1, formedgeColor1)
    form_group_mink.add(formMinkFacePt1Ob)
    const formMinkFacePt1Oc = minkFace4pt(formMSptDO1_Pt1O1, formMSptD, formMSptB, formMSptBO1_Pt1O1, formedgeColor1)
    form_group_mink.add(formMinkFacePt1Oc)
    const formMinkFacePt1Od = minkFace3pt(formMSptDO1_Pt1O1, formMSptBO1_Pt1O1, formMSptAO1_Pt1O1, formedgeColor1)
    form_group_mink.add(formMinkFacePt1Od)

    const formMSedgeBtPt1 = createCylinderMesh(formMSptAO1_Pt1O1, formMSptDO1_Pt1O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBtPt1)
    const formMSedgeBtPt12 = createCylinderMesh(formMSptAO1_Pt1O1, formMSptBO1_Pt1O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBtPt12)
    const formMSedgeBtPt13 = createCylinderMesh(formMSptBO1_Pt1O1, formMSptDO1_Pt1O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBtPt13)

    // b. from formMSptBO2 (0.8 is the max number of minkscale.l)
    var formMSptPt2O1temp = subVecUpdated(formTpPt[0], formBtPt2[1]);
    var formMSptBO1_Pt2O1 = new THREE.Vector3(
        formMSptB.x + (0.95 - minkscale.l) * formMSptPt2O1temp.x,
        formMSptB.y + (0.95 - minkscale.l) * formMSptPt2O1temp.y,
        formMSptB.z + (0.95 - minkscale.l) * formMSptPt2O1temp.z
    );
    const formMSedgeBO1_Pt2O1 = createCylinderMesh(formMSptB, formMSptBO1_Pt2O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBO1_Pt2O1)

    var formMSptCO1_Pt2O1 = new THREE.Vector3(
        formMSptC.x + (0.95 - minkscale.l) * formMSptPt2O1temp.x,
        formMSptC.y + (0.95 - minkscale.l) * formMSptPt2O1temp.y,
        formMSptC.z + (0.95 - minkscale.l) * formMSptPt2O1temp.z
    );
    const formMSedgeCO1_Pt2O1 = createCylinderMesh(formMSptC, formMSptCO1_Pt2O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeCO1_Pt2O1)

    var formMSptDO1_Pt2O1 = new THREE.Vector3(
        formMSptD.x + (0.95 - minkscale.l) * formMSptPt2O1temp.x,
        formMSptD.y + (0.95 - minkscale.l) * formMSptPt2O1temp.y,
        formMSptD.z + (0.95 - minkscale.l) * formMSptPt2O1temp.z
    );
    const formMSedgeDO1_Pt2O1 = createCylinderMesh(formMSptD, formMSptDO1_Pt2O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeDO1_Pt2O1)

    //a. edge 2 - 0
    const formMinkFacePt2Oa = minkFace4pt(formMSptCO1_Pt2O1, formMSptC, formMSptB, formMSptBO1_Pt2O1, formedgeColor2)
    form_group_mink.add(formMinkFacePt2Oa)
    const formMinkFacePt2Ob = minkFace4pt(formMSptBO1_Pt2O1, formMSptB, formMSptD, formMSptDO1_Pt2O1, formedgeColor2)
    form_group_mink.add(formMinkFacePt2Ob)
    const formMinkFacePt2Oc = minkFace4pt(formMSptDO1_Pt2O1, formMSptD, formMSptC, formMSptCO1_Pt2O1, formedgeColor2)
    form_group_mink.add(formMinkFacePt2Oc)
    const formMinkFacePt2Od = minkFace3pt(formMSptCO1_Pt2O1, formMSptDO1_Pt2O1, formMSptBO1_Pt2O1, formedgeColor2)
    form_group_mink.add(formMinkFacePt2Od)

    const formMSedgeBtPt2 = createCylinderMesh(formMSptBO1_Pt2O1, formMSptCO1_Pt2O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBtPt2)
    const formMSedgeBtPt22 = createCylinderMesh(formMSptBO1_Pt2O1, formMSptDO1_Pt2O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBtPt22)
    const formMSedgeBtPt23 = createCylinderMesh(formMSptCO1_Pt2O1, formMSptDO1_Pt2O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBtPt23)

    // c. from formMSptBO2 (0.8 is the max number of minkscale.l)
    var formMSptPt3O1temp = subVecUpdated(formTpPt[0], formBtPt3[1]);
    var formMSptAO1_Pt3O1 = new THREE.Vector3(
        formMSptA.x + (0.95 - minkscale.l) * formMSptPt3O1temp.x,
        formMSptA.y + (0.95 - minkscale.l) * formMSptPt3O1temp.y,
        formMSptA.z + (0.95 - minkscale.l) * formMSptPt3O1temp.z
    );
    const formMSedgeAO1_Pt3O1 = createCylinderMesh(formMSptA, formMSptAO1_Pt3O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeAO1_Pt3O1)

    var formMSptCO1_Pt3O1 = new THREE.Vector3(
        formMSptC.x + (0.95 - minkscale.l) * formMSptPt3O1temp.x,
        formMSptC.y + (0.95 - minkscale.l) * formMSptPt3O1temp.y,
        formMSptC.z + (0.95 - minkscale.l) * formMSptPt3O1temp.z
    );
    const formMSedgeCO1_Pt3O1 = createCylinderMesh(formMSptC, formMSptCO1_Pt3O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeCO1_Pt3O1)

    var formMSptDO1_Pt3O1 = new THREE.Vector3(
        formMSptD.x + (0.95 - minkscale.l) * formMSptPt3O1temp.x,
        formMSptD.y + (0.95 - minkscale.l) * formMSptPt3O1temp.y,
        formMSptD.z + (0.95 - minkscale.l) * formMSptPt3O1temp.z
    );
    const formMSedgeDO1_Pt3O1 = createCylinderMesh(formMSptD, formMSptDO1_Pt3O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeDO1_Pt3O1)

    const formMSedgeBtPt3 = createCylinderMesh(formMSptAO1_Pt3O1, formMSptCO1_Pt3O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBtPt3)
    const formMSedgeBtPt32 = createCylinderMesh(formMSptAO1_Pt3O1, formMSptDO1_Pt3O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBtPt32)
    const formMSedgeBtPt33 = createCylinderMesh(formMSptCO1_Pt3O1, formMSptDO1_Pt3O1, formMSedgeMaterial, minkedgeSize, minkedgeSize);
    form_group_mink.add(formMSedgeBtPt33)

    //a. edge 3 - 0
    const formMinkFacePt3Oa = minkFace4pt(formMSptAO1_Pt3O1, formMSptA, formMSptC, formMSptCO1_Pt3O1, formedgeColor3)
    form_group_mink.add(formMinkFacePt3Oa)
    const formMinkFacePt3Ob = minkFace4pt(formMSptDO1_Pt3O1, formMSptD, formMSptC, formMSptCO1_Pt3O1, formedgeColor3)
    form_group_mink.add(formMinkFacePt3Ob)
    const formMinkFacePt3Oc = minkFace4pt(formMSptDO1_Pt3O1, formMSptD, formMSptA, formMSptAO1_Pt3O1, formedgeColor3)
    form_group_mink.add(formMinkFacePt3Oc)
    const formMinkFacePt3Od = minkFace3pt(formMSptDO1_Pt3O1, formMSptAO1_Pt3O1, formMSptCO1_Pt3O1, formedgeColor3)
    form_group_mink.add(formMinkFacePt3Od)

    //add green apply face and center cell
    var formMinkFacePtABC = minkFace3pt(formMSptA, formMSptB, formMSptC, 0x009600)
    form_group_mink.add(formMinkFacePtABC)
    var formMinkFacePtABD = minkFace3pt(formMSptA, formMSptB, formMSptD, formedgeColor1)
    form_group_mink.add(formMinkFacePtABD)
    var formMinkFacePtBCD = minkFace3pt(formMSptB, formMSptC, formMSptD, formedgeColor2)
    form_group_mink.add(formMinkFacePtBCD)
    var formMinkFacePtACD = minkFace3pt(formMSptC, formMSptA, formMSptD, formedgeColor3)
    form_group_mink.add(formMinkFacePtACD)

    // ******************************************* mink force faces - 1

    if (resultapply > 0) {

        var result1 = normalABD.dot(edgeVector1)
        var result2 = normalBCD.dot(edgeVector2)
        var result3 = normalCAD.dot(edgeVector3)

    } else {

        var result1 = normalCAD.dot(edgeVector1)
        var result2 = normalBCD.dot(edgeVector2)
        var result3 = normalABD.dot(edgeVector3)

    }

    if (result1 < 0) {
        if (resultapply > 0) {
            if (areaABD / areaMax >= 0.75) {
                formedgeColor1 = 0x80002F
            }
            if (0.5 <= areaABD / areaMax && areaABD / areaMax < 0.75) {
                formedgeColor1 = 0x940041
            }
            if (0.25 <= areaABD / areaMax && areaABD / areaMax < 0.5) {
                formedgeColor1 = 0xCC0549
            }
            if (0 <= areaABD / areaMax && areaABD / areaMax < 0.25) {
                formedgeColor1 = 0xD72F62
            }
            var forceMinkFaceABD = minkFace3pt(forceMSptA, forceMSptB, forceMSptD, formedgeColor1)
            var forceMinkFaceExpandABD1 = minkFace4pt(forceMSedgeBend_Pt1O1, forceMSptB, forceMSptA, forceMSedgeAend_Pt1O1, formedgeColor1)
            var forceMinkFaceExpandABD2 = minkFace4pt(forceMSedgeAend_Pt1O1, forceMSptA, forceMSptD, forceMSedgeDend_Pt1O1, formedgeColor1)
            var forceMinkFaceExpandABD3 = minkFace4pt(forceMSedgeDend_Pt1O1, forceMSptD, forceMSptB, forceMSedgeBend_Pt1O1, formedgeColor1)
            var forceMinkFaceExpandABD4 = minkFace3pt(forceMSedgeDend_Pt1O1, forceMSedgeBend_Pt1O1, forceMSedgeAend_Pt1O1, formedgeColor1)

            force_group_mink.add(forceMinkFaceABD)
            force_group_mink.add(forceMinkFaceExpandABD1)
            force_group_mink.add(forceMinkFaceExpandABD2)
            force_group_mink.add(forceMinkFaceExpandABD3)
            force_group_mink.add(forceMinkFaceExpandABD4)


        } else {
            if (areaACD / areaMax >= 0.75) {
                formedgeColor1 = 0x80002F
            }
            if (0.5 <= areaACD / areaMax && areaACD / areaMax < 0.75) {
                formedgeColor1 = 0x940041
            }
            if (0.25 <= areaACD / areaMax && areaACD / areaMax < 0.5) {
                formedgeColor1 = 0xCC0549
            }
            if (0 <= areaACD / areaMax && areaACD / areaMax < 0.25) {
                formedgeColor1 = 0xD72F62
            }
            // force_group_mink.add( forceMinkFaceACD )
            var forceMinkFaceABD = minkFace3pt(forceMSptA, forceMSptB, forceMSptD, formedgeColor1)
            var forceMinkFaceExpandABD1 = minkFace4pt(forceMSedgeBend_Pt1O1, forceMSptB, forceMSptA, forceMSedgeAend_Pt1O1, formedgeColor1)
            var forceMinkFaceExpandABD2 = minkFace4pt(forceMSedgeAend_Pt1O1, forceMSptA, forceMSptD, forceMSedgeDend_Pt1O1, formedgeColor1)
            var forceMinkFaceExpandABD3 = minkFace4pt(forceMSedgeDend_Pt1O1, forceMSptD, forceMSptB, forceMSedgeBend_Pt1O1, formedgeColor1)
            var forceMinkFaceExpandABD4 = minkFace3pt(forceMSedgeDend_Pt1O1, forceMSedgeBend_Pt1O1, forceMSedgeAend_Pt1O1, formedgeColor1)

            force_group_mink.add(forceMinkFaceABD)
            force_group_mink.add(forceMinkFaceExpandABD1)
            force_group_mink.add(forceMinkFaceExpandABD2)
            force_group_mink.add(forceMinkFaceExpandABD3)
            force_group_mink.add(forceMinkFaceExpandABD4)
        }
    } else {
        if (resultapply > 0) {
            if (areaABD / areaMax >= 0.75) {
                formedgeColor1 = 0x0F3150
            }
            if (0.5 <= areaABD / areaMax && areaABD / areaMax < 0.75) {
                formedgeColor1 = 0x05416D
            }
            if (0.25 <= areaABD / areaMax && areaABD / areaMax < 0.5) {
                formedgeColor1 = 0x376D9B
            }
            if (0 <= areaABD / areaMax && areaABD / areaMax < 0.25) {
                formedgeColor1 = 0x5B84AE
            }
            // var forceMinkFaceABD =  minkFace3pt(forceMSptA, forceMSptB, forceMSptD,formedgeColor1)
            // force_group_mink.add( forceMinkFaceABD )
            var forceMinkFaceABD = minkFace3pt(forceMSptA, forceMSptB, forceMSptD, formedgeColor1)
            var forceMinkFaceExpandABD1 = minkFace4pt(forceMSedgeBend_Pt1O1, forceMSptB, forceMSptA, forceMSedgeAend_Pt1O1, formedgeColor1)
            var forceMinkFaceExpandABD2 = minkFace4pt(forceMSedgeAend_Pt1O1, forceMSptA, forceMSptD, forceMSedgeDend_Pt1O1, formedgeColor1)
            var forceMinkFaceExpandABD3 = minkFace4pt(forceMSedgeDend_Pt1O1, forceMSptD, forceMSptB, forceMSedgeBend_Pt1O1, formedgeColor1)
            var forceMinkFaceExpandABD4 = minkFace3pt(forceMSedgeDend_Pt1O1, forceMSedgeBend_Pt1O1, forceMSedgeAend_Pt1O1, formedgeColor1)

            force_group_mink.add(forceMinkFaceABD)
            force_group_mink.add(forceMinkFaceExpandABD1)
            force_group_mink.add(forceMinkFaceExpandABD2)
            force_group_mink.add(forceMinkFaceExpandABD3)
            force_group_mink.add(forceMinkFaceExpandABD4)

        } else {
            if (areaACD / areaMax >= 0.75) {
                formedgeColor1 = 0x0F3150
            }
            if (0.5 <= areaACD / areaMax && areaACD / areaMax < 0.75) {
                formedgeColor1 = 0x05416D
            }
            if (0.25 <= areaACD / areaMax && areaACD / areaMax < 0.5) {
                formedgeColor1 = 0x376D9B
            }
            if (0 <= areaACD / areaMax && areaACD / areaMax < 0.25) {
                formedgeColor1 = 0x5B84AE
            }
            //  var forceMinkFaceACD = ForceFace3pt(forceMSptC, forceMSptA, forceMSptD, formedgeColor1);
            // force_group_mink.add( forceMinkFaceACD )
            var forceMinkFaceABD = minkFace3pt(forceMSptA, forceMSptB, forceMSptD, formedgeColor1)
            var forceMinkFaceExpandABD1 = minkFace4pt(forceMSedgeBend_Pt1O1, forceMSptB, forceMSptA, forceMSedgeAend_Pt1O1, formedgeColor1)
            var forceMinkFaceExpandABD2 = minkFace4pt(forceMSedgeAend_Pt1O1, forceMSptA, forceMSptD, forceMSedgeDend_Pt1O1, formedgeColor1)
            var forceMinkFaceExpandABD3 = minkFace4pt(forceMSedgeDend_Pt1O1, forceMSptD, forceMSptB, forceMSedgeBend_Pt1O1, formedgeColor1)
            var forceMinkFaceExpandABD4 = minkFace3pt(forceMSedgeDend_Pt1O1, forceMSedgeBend_Pt1O1, forceMSedgeAend_Pt1O1, formedgeColor1)

            force_group_mink.add(forceMinkFaceABD)
            force_group_mink.add(forceMinkFaceExpandABD1)
            force_group_mink.add(forceMinkFaceExpandABD2)
            force_group_mink.add(forceMinkFaceExpandABD3)
            force_group_mink.add(forceMinkFaceExpandABD4)
        }
    }

    // ******************************************* mink force faces - 2
    if (result2 < 0) {

        if (areaBCD / areaMax >= 0.75) {
            formedgeColor2 = 0x80002F
        }
        if (0.5 <= areaBCD / areaMax && areaBCD / areaMax < 0.75) {
            formedgeColor2 = 0x940041
        }
        if (0.25 <= areaBCD / areaMax && areaBCD / areaMax < 0.5) {
            formedgeColor2 = 0xCC0549
        }
        if (0 <= areaBCD / areaMax && areaBCD / areaMax < 0.25) {
            formedgeColor2 = 0xD72F62
        }
        var forceMinkFaceBCD = minkFace3pt(forceMSptB, forceMSptC, forceMSptD, formedgeColor1)
        var forceMinkFaceExpandBCD1 = minkFace4pt(forceMSedgeBend_Pt2O1, forceMSptB, forceMSptD, forceMSedgeDend_Pt2O1, formedgeColor2)
        var forceMinkFaceExpandBCD2 = minkFace4pt(forceMSedgeCend_Pt2O1, forceMSptC, forceMSptB, forceMSedgeBend_Pt2O1, formedgeColor2)
        var forceMinkFaceExpandBCD3 = minkFace4pt(forceMSedgeDend_Pt2O1, forceMSptD, forceMSptB, forceMSedgeBend_Pt2O1, formedgeColor2)
        var forceMinkFaceExpandBCD4 = minkFace3pt(forceMSedgeDend_Pt2O1, forceMSedgeCend_Pt2O1, forceMSedgeBend_Pt2O1, formedgeColor2)

        force_group_mink.add(forceMinkFaceBCD)
        force_group_mink.add(forceMinkFaceExpandBCD1)
        force_group_mink.add(forceMinkFaceExpandBCD2)
        force_group_mink.add(forceMinkFaceExpandBCD3)
        force_group_mink.add(forceMinkFaceExpandBCD4)
    } else {

        if (areaBCD / areaMax >= 0.75) {
            formedgeColor2 = 0x0F3150
        }
        if (0.5 <= areaBCD / areaMax && areaBCD / areaMax < 0.75) {
            formedgeColor2 = 0x05416D
        }
        if (0.25 <= areaBCD / areaMax && areaBCD / areaMax < 0.5) {
            formedgeColor2 = 0x376D9B
        }
        if (0 <= areaBCD / areaMax && areaBCD / areaMax < 0.25) {
            formedgeColor2 = 0x5B84AE
        }
        var forceMinkFaceBCD = minkFace3pt(forceMSptB, forceMSptC, forceMSptD, formedgeColor1)
        var forceMinkFaceExpandBCD1 = minkFace4pt(forceMSedgeBend_Pt2O1, forceMSptB, forceMSptD, forceMSedgeDend_Pt2O1, formedgeColor2)
        var forceMinkFaceExpandBCD2 = minkFace4pt(forceMSedgeCend_Pt2O1, forceMSptC, forceMSptB, forceMSedgeBend_Pt2O1, formedgeColor2)
        var forceMinkFaceExpandBCD3 = minkFace4pt(forceMSedgeDend_Pt2O1, forceMSptD, forceMSptB, forceMSedgeBend_Pt2O1, formedgeColor2)
        var forceMinkFaceExpandBCD4 = minkFace3pt(forceMSedgeDend_Pt2O1, forceMSedgeCend_Pt2O1, forceMSedgeBend_Pt2O1, formedgeColor2)

        force_group_mink.add(forceMinkFaceBCD)
        force_group_mink.add(forceMinkFaceExpandBCD1)
        force_group_mink.add(forceMinkFaceExpandBCD2)
        force_group_mink.add(forceMinkFaceExpandBCD3)
        force_group_mink.add(forceMinkFaceExpandBCD4)
    }

// ******************************************* mink force faces - 3

    if (result3 < 0) {
        if (resultapply > 0) {
            if (areaACD / areaMax >= 0.75) {
                formedgeColor3 = 0x80002F
            }
            if (0.5 <= areaACD / areaMax && areaACD / areaMax < 0.75) {
                formedgeColor3 = 0x940041
            }
            if (0.25 <= areaACD / areaMax && areaACD / areaMax < 0.5) {
                formedgeColor3 = 0xCC0549
            }
            if (0 <= areaACD / areaMax && areaACD / areaMax < 0.25) {
                formedgeColor3 = 0xD72F62
            }
            var forceMinkFaceACD = minkFace3pt(forceMSptA, forceMSptC, forceMSptD, formedgeColor1)
            var forceMinkFaceExpandACD1 = minkFace4pt(forceMSedgeCend_Pt3O1, forceMSptC, forceMSptD, forceMSedgeDend_Pt3O1, formedgeColor3)
            var forceMinkFaceExpandACD2 = minkFace4pt(forceMSedgeAend_Pt3O1, forceMSptA, forceMSptC, forceMSedgeCend_Pt3O1, formedgeColor3)
            var forceMinkFaceExpandACD3 = minkFace4pt(forceMSedgeDend_Pt3O1, forceMSptD, forceMSptA, forceMSedgeAend_Pt3O1, formedgeColor3)
            var forceMinkFaceExpandACD4 = minkFace3pt(forceMSedgeDend_Pt3O1, forceMSedgeCend_Pt3O1, forceMSedgeAend_Pt3O1, formedgeColor3)

            force_group_mink.add(forceMinkFaceACD)
            force_group_mink.add(forceMinkFaceExpandACD1)
            force_group_mink.add(forceMinkFaceExpandACD2)
            force_group_mink.add(forceMinkFaceExpandACD3)
            force_group_mink.add(forceMinkFaceExpandACD4)
        } else {
            if (areaABD / areaMax >= 0.75) {
                formedgeColor3 = 0x80002F
            }
            if (0.5 <= areaABD / areaMax && areaABD / areaMax < 0.75) {
                formedgeColor3 = 0x940041
            }
            if (0.25 <= areaABD / areaMax && areaABD / areaMax < 0.5) {
                formedgeColor3 = 0xCC0549
            }
            if (0 <= areaABD / areaMax && areaABD / areaMax < 0.25) {
                formedgeColor3 = 0xD72F62
            }
            var forceMinkFaceACD = minkFace3pt(forceMSptA, forceMSptC, forceMSptD, formedgeColor1)
            var forceMinkFaceExpandACD1 = minkFace4pt(forceMSedgeCend_Pt3O1, forceMSptC, forceMSptD, forceMSedgeDend_Pt3O1, formedgeColor3)
            var forceMinkFaceExpandACD2 = minkFace4pt(forceMSedgeAend_Pt3O1, forceMSptA, forceMSptC, forceMSedgeCend_Pt3O1, formedgeColor3)
            var forceMinkFaceExpandACD3 = minkFace4pt(forceMSedgeDend_Pt3O1, forceMSptD, forceMSptA, forceMSedgeAend_Pt3O1, formedgeColor3)
            var forceMinkFaceExpandACD4 = minkFace3pt(forceMSedgeDend_Pt3O1, forceMSedgeCend_Pt3O1, forceMSedgeAend_Pt3O1, formedgeColor3)

            force_group_mink.add(forceMinkFaceACD)
            force_group_mink.add(forceMinkFaceExpandACD1)
            force_group_mink.add(forceMinkFaceExpandACD2)
            force_group_mink.add(forceMinkFaceExpandACD3)
            force_group_mink.add(forceMinkFaceExpandACD4)
        }

    } else {
        if (resultapply > 0) {
            if (areaACD / areaMax >= 0.75) {
                formedgeColor3 = 0x0F3150
            }
            if (0.5 <= areaACD / areaMax && areaACD / areaMax < 0.75) {
                formedgeColor3 = 0x05416D
            }
            if (0.25 <= areaACD / areaMax && areaACD / areaMax < 0.5) {
                formedgeColor3 = 0x376D9B
            }
            if (0 <= areaACD / areaMax && areaACD / areaMax < 0.25) {
                formedgeColor3 = 0x5B84AE
            }
            var forceMinkFaceACD = minkFace3pt(forceMSptA, forceMSptC, forceMSptD, formedgeColor1)
            var forceMinkFaceExpandACD1 = minkFace4pt(forceMSedgeCend_Pt3O1, forceMSptC, forceMSptD, forceMSedgeDend_Pt3O1, formedgeColor3)
            var forceMinkFaceExpandACD2 = minkFace4pt(forceMSedgeAend_Pt3O1, forceMSptA, forceMSptC, forceMSedgeCend_Pt3O1, formedgeColor3)
            var forceMinkFaceExpandACD3 = minkFace4pt(forceMSedgeDend_Pt3O1, forceMSptD, forceMSptA, forceMSedgeAend_Pt3O1, formedgeColor3)
            var forceMinkFaceExpandACD4 = minkFace3pt(forceMSedgeDend_Pt3O1, forceMSedgeCend_Pt3O1, forceMSedgeAend_Pt3O1, formedgeColor3)

            force_group_mink.add(forceMinkFaceACD)
            force_group_mink.add(forceMinkFaceExpandACD1)
            force_group_mink.add(forceMinkFaceExpandACD2)
            force_group_mink.add(forceMinkFaceExpandACD3)
            force_group_mink.add(forceMinkFaceExpandACD4)

        } else {
            if (areaABD / areaMax >= 0.75) {
                formedgeColor3 = 0x0F3150
            }
            if (0.5 <= areaABD / areaMax && areaABD / areaMax < 0.75) {
                formedgeColor3 = 0x05416D
            }
            if (0.25 <= areaABD / areaMax && areaABD / areaMax < 0.5) {
                formedgeColor3 = 0x376D9B
            }
            if (0 <= areaABD / areaMax && areaABD / areaMax < 0.25) {
                formedgeColor3 = 0x5B84AE
            }
            var forceMinkFaceACD = minkFace3pt(forceMSptA, forceMSptC, forceMSptD, formedgeColor1)
            var forceMinkFaceExpandACD1 = minkFace4pt(forceMSedgeCend_Pt3O1, forceMSptC, forceMSptD, forceMSedgeDend_Pt3O1, formedgeColor3)
            var forceMinkFaceExpandACD2 = minkFace4pt(forceMSedgeAend_Pt3O1, forceMSptA, forceMSptC, forceMSedgeCend_Pt3O1, formedgeColor3)
            var forceMinkFaceExpandACD3 = minkFace4pt(forceMSedgeDend_Pt3O1, forceMSptD, forceMSptA, forceMSedgeAend_Pt3O1, formedgeColor3)
            var forceMinkFaceExpandACD4 = minkFace3pt(forceMSedgeDend_Pt3O1, forceMSedgeCend_Pt3O1, forceMSedgeAend_Pt3O1, formedgeColor3)

            force_group_mink.add(forceMinkFaceACD)
            force_group_mink.add(forceMinkFaceExpandACD1)
            force_group_mink.add(forceMinkFaceExpandACD2)
            force_group_mink.add(forceMinkFaceExpandACD3)
            force_group_mink.add(forceMinkFaceExpandACD4)
        }

    }
    var forceMinkFaceABC = minkFace3pt(forceMSptA, forceMSptB, forceMSptC, 0x009600)
    force_group_mink.add(forceMinkFaceABC)

    form_group_mink.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = minkVisibilityCheckboxParams.show;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = minkVisibilityCheckboxParams.show;
        }
    });

    force_group_mink.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = minkVisibilityCheckboxParams.show;
        }
    });

    form_group_e.traverse(function (obj) {
        if (obj.type === "Mesh") {
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
        if (obj.type === "LineSegments") {
            obj.material.visible = !minkVisibilityCheckboxParams.show;
        }
        if (obj.type === "Sprite") {
            obj.material.visible = !minkVisibilityCheckboxParams.show;
        }
    });

    scene.add(form_group_mink);
    scene2.add(force_group_mink);
}

// *********************** redraw the form and force diagram when parameter is changing ****************
function Redraw() {

    if (faceVisibilityCheckboxParams.face) {
        redrawFace();
    }
    if (cellVisibilityCheckboxParams.cell) {
        redrawCell();
    }

    //form groups
    scene.remove(form_group_v);
    scene.remove(form_group_e);
    scene.remove(form_general);
    scene.remove(form_group_step);
    scene.remove(form_group_step_3);
    scene.remove(form_group_step_4);
    scene.remove(form_group_step_5);
    scene.remove(form_group_step_6);
    scene.remove(form_group_step_7);

    form_group_v = new THREE.Group();
    form_group_e = new THREE.Group();
    form_general = new THREE.Group();
    form_group_step = new THREE.Group();
    form_group_step_3 = new THREE.Group();
    form_group_step_4 = new THREE.Group();
    form_group_step_5 = new THREE.Group();
    form_group_step_6 = new THREE.Group();
    form_group_step_7 = new THREE.Group();

    //force groups
    scene2.remove(force_group_f);
    scene2.remove(force_group_e);
    scene2.remove(force_group_c);
    scene2.remove(force_general);

    scene2.remove(force_group_step);
    scene2.remove(force_group_step_3);
    scene2.remove(force_group_step_4);
    scene2.remove(force_group_step_5);
    scene2.remove(force_group_step_6);
    scene2.remove(force_group_step_7);

    force_group_f = new THREE.Group();
    force_group_e = new THREE.Group();
    force_group_c = new THREE.Group();
    force_general = new THREE.Group();

    force_group_step = new THREE.Group();
    force_group_step_3 = new THREE.Group();
    force_group_step_4 = new THREE.Group();
    force_group_step_5 = new THREE.Group();
    force_group_step_6 = new THREE.Group();
    force_group_step_7 = new THREE.Group();


    // *********************** form vertices **************************
    // set basic points in form diagram (one top, one mid (0,0,0), three bottoms)
    // 1st. mid point
    const vertice_0 = addVertice(0.05, "sp0", new THREE.Vector3(0, 0, 0));
    const vertice_0_out = addVerticeOut(0.05, new THREE.Vector3(0, 0, 0), 1.55)
    form_group_v.add(vertice_0);
    form_group_v.add(vertice_0_out);

    //2nd. bottom point (movable) - bottom vertice 1
    const vertice_1 = addVerticeSup(0.04, "sp1", formBtPt1[1])
    Ctrl_pts[0] = vertice_1; //adding to gumball selection
    const vertice_1_out = addVerticeOutSup(0.04, vertice_1.position, 1.55);

    form_group_v.add(vertice_1);
    form_group_v.add(vertice_1_out);

    //3rd. bottom point (movable) - bottom vertice 2
    const vertice_2 = addVerticeSup(0.04, "sp2", formBtPt2[1])
    Ctrl_pts[1] = vertice_2; //adding to gumball selection
    const vertice_2_out = addVerticeOutSup(0.04, vertice_2.position, 1.55);

    form_group_v.add(vertice_2);
    form_group_v.add(vertice_2_out);

    //4th. bottom point (movable) - bottom vertice 3
    const vertice_3 = addVerticeSup(0.04, "sp3", formBtPt3[1])
    Ctrl_pts[2] = vertice_3; //adding to gumball selection
    const vertice_3_out = addVerticeOutSup(0.04, vertice_3.position, 1.55);
    form_group_v.add(vertice_3);
    form_group_v.add(vertice_3_out);

    var TXformNode1 = createSpriteText('1', "", new THREE.Vector3(formBtPt1[1].x, formBtPt1[1].y, formBtPt1[1].z + 0.1));
    form_general.add(TXformNode1);
    var TXformNode2 = createSpriteText('2', "", new THREE.Vector3(formBtPt2[1].x, formBtPt2[1].y, formBtPt2[1].z + 0.1));
    form_general.add(TXformNode2);
    var TXformNode3 = createSpriteText('3', "", new THREE.Vector3(formBtPt3[1].x, formBtPt3[1].y, formBtPt3[1].z + 0.1));
    form_general.add(TXformNode3);


    //add text
    var TXapplyForce = createSpriteTextApply('f', "1", new THREE.Vector3(formTpPt[1].x, formTpPt[1].y, formTpPt[1].z + 0.35));
    form_general.add(TXapplyForce);

    // *********************** form apply loads dash lines **************************
    const dashline = dashLinesGR(formTpPt[0], formTpPt[1], 0.008, 0.01, 1.02);
    form_general.add(dashline);

    // *********************** form apply loads arrow **************************
    var applyArrowMaterial = new THREE.MeshPhongMaterial({
        color: 0x009600//green
    });

    var applyArrowMaterialOut = new THREE.MeshPhongMaterial({
        color: "white",
        transparent: false,
        side: THREE.BackSide
    });
    const applyArrow = createCylinderArrowMesh(new THREE.Vector3(formTpPt[1].x, formTpPt[1].y, formTpPt[1].z + 0.3), formTpPt[1], applyArrowMaterial, 0.015, 0.035, 0.55);
    form_general.add(applyArrow);

    const applyArrowOut = createCylinderArrowMesh(new THREE.Vector3(formTpPt[1].x, formTpPt[1].y, formTpPt[1].z + 0.3), formTpPt[1], applyArrowMaterialOut, 0.02, 0.04, 0.545);
    form_general.add(applyArrowOut);


    // *****************
    // force
    // ******************

    // *********************** force diagram ***********************
    // *********************** force points ***********************
    var edgescale = 2; // size of the force diagram

    //PtA and PtB
    var forcePtA = new THREE.Vector3(1, 0.2, 0)

    var forcePtBtemp = CalNormalVectorUpdated(formBtPt1[1], formTpPt[1], formTpPt[0], edgescale);
    var forcePtB = new THREE.Vector3(forcePtA.x - forcePtBtemp.x, forcePtA.y - forcePtBtemp.y, forcePtA.z - forcePtBtemp.z);

    //PtC

    var forcePtC1temp = CalNormalVectorUpdated(formBtPt2[1], formTpPt[1], formTpPt[0], edgescale);
    var forcePtC1 = new THREE.Vector3(forcePtB.x - forcePtC1temp.x, forcePtB.y - forcePtC1temp.y, forcePtB.z - forcePtC1temp.z);

    var forcePtC2temp = CalNormalVectorUpdated(formBtPt3[1], formTpPt[1], formTpPt[0], edgescale);
    var forcePtC2 = new THREE.Vector3(forcePtA.x - forcePtC2temp.x, forcePtA.y - forcePtC2temp.y, forcePtA.z - forcePtC2temp.z);

    var dirBC = new THREE.Vector3(); // create once an reuse it

    dirBC.subVectors(forcePtB, forcePtC1).normalize();

    var dirAC = new THREE.Vector3(); // create once an reuse it

    dirAC.subVectors(forcePtC2, forcePtA).normalize();
    var forcePtC = LinesSectPt(dirBC, forcePtB, dirAC, forcePtA);

    // *********************** calculating the normals for apply loads ***********************
    // triangle ABC
    var normalABC_a = subVec(forcePtA, forcePtB)
    var normalABC_b = subVec(forcePtB, forcePtC)
    var normalABC = cross(normalABC_a, normalABC_b)

    var edgeVector0 = subVec(formTpPt[0], formTpPt[1]);
    var resultapply = normalABC.dot(edgeVector0)

    // redefine the force points PtB, PtC ( one condition is that the force diagram flipped)

    if (resultapply < 0) {

        var lenAC = forcePtA.distanceTo(forcePtC);
        var forcePtBnew = addVectorAlongDir(forcePtC, forcePtA, lenAC)

        var lenAB = forcePtA.distanceTo(forcePtB);
        forcePtC = addVectorAlongDir(forcePtB, forcePtA, lenAB)
        forcePtB = forcePtBnew

    }

    // redefine the force point PtD ( one condition is that the force diagram flipped)

    //PtD

    if (resultapply > 0) {
        var forcePtD1temp = CalNormalVectorUpdated(formBtPt1[1], formTpPt[0], formBtPt3[1], edgescale);
        var forcePtD1 = new THREE.Vector3(forcePtA.x - forcePtD1temp.x, forcePtA.y - forcePtD1temp.y, forcePtA.z - forcePtD1temp.z);

        var forcePtD2temp = CalNormalVectorUpdated(formBtPt2[1], formTpPt[0], formBtPt1[1], edgescale);
        var forcePtD2 = new THREE.Vector3(forcePtB.x - forcePtD2temp.x, forcePtB.y - forcePtD2temp.y, forcePtB.z - forcePtD2temp.z);

        var dirAD = new THREE.Vector3(); // create once an reuse it

        dirAD.subVectors(forcePtA, forcePtD1).normalize();

        var dirBD = new THREE.Vector3(); // create once an reuse it

        dirBD.subVectors(forcePtD2, forcePtB).normalize();
        var forcePtD = LinesSectPt(dirAD, forcePtA, dirBD, forcePtB);
    } else {
        var forcePtD1temp = CalNormalVectorUpdated(formBtPt1[1], formTpPt[0], formBtPt3[1], edgescale);
        var forcePtD1 = new THREE.Vector3(forcePtA.x - forcePtD1temp.x, forcePtA.y - forcePtD1temp.y, forcePtA.z - forcePtD1temp.z);

        var forcePtD2temp = CalNormalVectorUpdated(formBtPt3[1], formTpPt[0], formBtPt2[1], edgescale);
        var forcePtD2 = new THREE.Vector3(forcePtB.x - forcePtD2temp.x, forcePtB.y - forcePtD2temp.y, forcePtB.z - forcePtD2temp.z);

        var dirAD = new THREE.Vector3(); // create once an reuse it

        dirAD.subVectors(forcePtA, forcePtD1).normalize();

        var dirBD = new THREE.Vector3(); // create once an reuse it

        dirBD.subVectors(forcePtD2, forcePtB).normalize();
        var forcePtD = LinesSectPt(dirAD, forcePtA, dirBD, forcePtB);
    }
    var applyForceArrowMaterial = new THREE.MeshPhongMaterial({
        color: 0x009600//green
    });

    var applyForceArrowMaterialOut = new THREE.MeshPhongMaterial({
        color: "white",
        transparent: false,
        side: THREE.BackSide
    });

    var forcePtA_text = createSpriteText('A', "", new THREE.Vector3(forcePtA.x, forcePtA.y, forcePtA.z + 0.05))
    force_general.add(forcePtA_text)
    var forcePtB_text = createSpriteText('B', "", new THREE.Vector3(forcePtB.x, forcePtB.y, forcePtB.z + 0.05))
    force_general.add(forcePtB_text)
    var forcePtC_text = createSpriteText('C', "", new THREE.Vector3(forcePtC.x, forcePtC.y, forcePtC.z + 0.05))
    force_general.add(forcePtC_text)
    if (forcePtD.z < 0) {
        var forcePtD_text = createSpriteText('D', "", new THREE.Vector3(forcePtD.x, forcePtD.y, forcePtD.z - 0.15))
        force_general.add(forcePtD_text)
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
    } else {
        var forcePtD_text = createSpriteText('D', "", new THREE.Vector3(forcePtD.x, forcePtD.y, forcePtD.z + 0.1))
        force_general.add(forcePtD_text)
        const applyArrow = createCylinderArrowMesh(
            face_center(forcePtA, forcePtB, forcePtC),
            new THREE.Vector3(
                face_center(forcePtA, forcePtB, forcePtC).x,
                face_center(forcePtA, forcePtB, forcePtC).y,
                face_center(forcePtA, forcePtB, forcePtC).z - 0.4), applyForceArrowMaterial, 0.015, 0.04, 0.55);
        force_general.add(applyArrow);
        const applyArrowOut = createCylinderArrowMesh(
            face_center(forcePtA, forcePtB, forcePtC),
            new THREE.Vector3(
                face_center(forcePtA, forcePtB, forcePtC).x,
                face_center(forcePtA, forcePtB, forcePtC).y,
                face_center(forcePtA, forcePtB, forcePtC).z - 0.4), applyForceArrowMaterialOut, 0.02, 0.045, 0.545);
        force_general.add(applyArrowOut);
    }

    var ABDarrow = createCircleFaceArrow(face_center(forcePtA, forcePtB, forcePtD), 0.15, cross(subVecUpdated(forcePtB, forcePtA), subVecUpdated(forcePtA, forcePtD)))
    force_general.add(ABDarrow);

    var ACDarrow = createCircleFaceArrow(face_center(forcePtA, forcePtC, forcePtD), 0.15, cross(subVecUpdated(forcePtA, forcePtC), subVecUpdated(forcePtC, forcePtD)))
    force_general.add(ACDarrow);

    var BCDarrow = createCircleFaceArrow(face_center(forcePtB, forcePtC, forcePtD), 0.15, cross(subVecUpdated(forcePtC, forcePtB), subVecUpdated(forcePtB, forcePtD)))
    force_general.add(BCDarrow);

    // face ABC
    var forceFaceABC = ForceFace3pt(forcePtA, forcePtB, forcePtC, 0x014F06)
    force_group_f.add(forceFaceABC)

    var ABCarrow = createCircleFaceArrow(face_center(forcePtA, forcePtB, forcePtC), 0.15, cross(subVecUpdated(forcePtA, forcePtB), subVecUpdated(forcePtB, forcePtC)))
    force_general.add(ABCarrow);

    // *********************** calculating the areas of triangles (from the four points) ***********************

    var areaABD = create_force_face_area(forcePtA, forcePtB, forcePtD);
    var areaBCD = create_force_face_area(forcePtB, forcePtC, forcePtD);
    var areaACD = create_force_face_area(forcePtA, forcePtC, forcePtD);

    var areaMax = Math.max(areaABD, areaBCD, areaACD);

    // *********************** calculating the normals for each triangle ***********************

    // ****** calculating normals *******
    // A = p2 - p1, B = p3 - p1
    // Nx = Ay * Bz - Az * By
    // Ny = Az * Bx - Ax * Bz
    // Nz = Ax * By - Ay * Bx
    // ******

    // triangle ABD
    var normalABD_a = subVec(forcePtB, forcePtA)
    var normalABD_b = subVec(forcePtA, forcePtD)
    var normalABD = cross(normalABD_a, normalABD_b)

    var edgeVector1 = subVec(formTpPt[0], formBtPt1[1]);

    // triangle BCD
    var normalBCD_a = subVec(forcePtC, forcePtB)
    var normalBCD_b = subVec(forcePtB, forcePtD)
    var normalBCD = cross(normalBCD_a, normalBCD_b)

    var edgeVector2 = subVec(formTpPt[0], formBtPt2[1]);

    // triangle ACD
    var normalCAD_a = subVec(forcePtA, forcePtC)
    var normalCAD_b = subVec(forcePtC, forcePtD)
    var normalCAD = cross(normalCAD_a, normalCAD_b)

    var edgeVector3 = subVec(formTpPt[0], formBtPt3[1]);

    // *********************** force cells **************************
    const forceCell = addCell4Face(forcePtD, forcePtA, forcePtB, forcePtC, forceCellScale)
    force_group_c.add(forceCell);
    force_group_c.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = false;
        }
    });

    // *********************** force edges **************************
    //testing the force edges
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

    const forceEdgeBD = createCylinderMesh(forcePtB, forcePtD, forceEdgeMaterial, edgeSize, edgeSize);

    force_group_e.add(forceEdgeBD)

    const forceEdgeCD = createCylinderMesh(forcePtC, forcePtD, forceEdgeMaterial, edgeSize, edgeSize);

    force_group_e.add(forceEdgeCD)

    addEdgeSphere(edgeSize, forcePtA, edgeColor)
    addEdgeSphere(edgeSize, forcePtB, edgeColor)
    addEdgeSphere(edgeSize, forcePtC, edgeColor)
    addEdgeSphere(edgeSize, forcePtD, edgeColor)


    // *********************** form edges **************************
    var formedgeColor1, formedgeColor2, formedgeColor3

    var edgeSize1, edgeSize2, edgeSize3;
    var result1, result2, result3;

    if (resultapply > 0) {
        edgeSize1 = areaABD * 0.05;
        edgeSize2 = areaBCD * 0.05;
        edgeSize3 = areaACD * 0.05;

        edgeSize1 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);
        edgeSize2 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);
        edgeSize3 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);

        result1 = normalABD.dot(edgeVector1)
        result2 = normalBCD.dot(edgeVector2)
        result3 = normalCAD.dot(edgeVector3)
    } else {
        edgeSize1 = areaACD * 0.05;
        edgeSize2 = areaBCD * 0.05;
        edgeSize3 = areaABD * 0.05;

        edgeSize1 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);
        edgeSize2 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);
        edgeSize3 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);

        result1 = normalCAD.dot(edgeVector1)
        result2 = normalBCD.dot(edgeVector2)
        result3 = normalABD.dot(edgeVector3)
    }
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


    // ************************  old arrow direction function (no use)  ************************
    function drawForceNormalsGlobal(forcePtA, forcePtB, forcePtC, normal_apply, normal_apply_outline, number) {
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

    function drawForceNormals(forcePtA, forcePtB, forcePtC, edgePt1, edgePt2, normal_apply, normal_apply_outline, number) {
        var forceFaceABDcenter = face_center(forcePtA, forcePtB, forcePtC)
        const endforceFaceABDa = subVecUpdated(edgePt1, edgePt2);
        var endforceFaceABDb = drawArrowfromVec(forceFaceABDcenter, endforceFaceABDa, 0.01)
        const endPtArrowABDb1 = addVectorAlongDir(forceFaceABDcenter, endforceFaceABDb, 0.01);
        const endPtArrowABDb2 = addVectorAlongDir(forceFaceABDcenter, endforceFaceABDb, 0.45);
        var ABDarrow1 = createCylinderArrowMesh(endPtArrowABDb1, endPtArrowABDb2, normal_apply, 0.02, 0.05, 0.56);
        force_general.add(ABDarrow1);
        var ABDarrow12 = createCylinderArrowMesh(endPtArrowABDb1, endPtArrowABDb2, normal_apply_outline, 0.025, 0.06, 0.56);
        force_general.add(ABDarrow12);
        var TXfaceNormal1 = createSpriteTextApply('n', number, new THREE.Vector3(endPtArrowABDb2.x, endPtArrowABDb2.y, endPtArrowABDb2.z + 0.1));
        force_general.add(TXfaceNormal1);
    }

    function drawForceNormals2(forcePtA, forcePtB, forcePtC, edgePt1, edgePt2, normal_apply, normal_apply_outline, number) {
        var forceFaceABDcenter = face_center(forcePtA, forcePtB, forcePtC)
        const endforceFaceABDa = subVecUpdated(edgePt1, edgePt2);
        var endforceFaceABDb = drawArrowfromVec(forceFaceABDcenter, endforceFaceABDa, 0.01)
        const endPtArrowABDb1 = addVectorAlongDir(forceFaceABDcenter, endforceFaceABDb, 0.01);
        const endPtArrowABDb2 = addVectorAlongDir(forceFaceABDcenter, endforceFaceABDb, 0.45);
        var ABDarrow1 = createCylinderArrowMesh(endPtArrowABDb2, endPtArrowABDb1, normal_apply, 0.02, 0.05, 0.56);
        force_general.add(ABDarrow1);
        var ABDarrow12 = createCylinderArrowMesh(endPtArrowABDb2, endPtArrowABDb1, normal_apply_outline, 0.025, 0.06, 0.56);
        force_general.add(ABDarrow12);
        var TXfaceNormal1 = createSpriteTextApply('n', number, new THREE.Vector3(endPtArrowABDb2.x, endPtArrowABDb2.y, endPtArrowABDb2.z + 0.1));
        force_general.add(TXfaceNormal1);
    }

    function drawForceNormals3(forcePtA, forcePtB, forcePtC, edgePt1, edgePt2, normal_apply, normal_apply_outline, number) {
        var forceFaceABDcenter = face_center(forcePtA, forcePtB, forcePtC)
        const endforceFaceABDa = subVecUpdated(edgePt1, edgePt2);
        var endforceFaceABDb = drawArrowfromVec(forceFaceABDcenter, endforceFaceABDa, -0.01)
        const endPtArrowABDb1 = addVectorAlongDir(forceFaceABDcenter, endforceFaceABDb, -0.01);
        const endPtArrowABDb2 = addVectorAlongDir(forceFaceABDcenter, endforceFaceABDb, -0.45);
        var ABDarrow1 = createCylinderArrowMesh(endPtArrowABDb1, endPtArrowABDb2, normal_apply, 0.02, 0.05, 0.56);
        force_general.add(ABDarrow1);
        var ABDarrow12 = createCylinderArrowMesh(endPtArrowABDb1, endPtArrowABDb2, normal_apply_outline, 0.025, 0.06, 0.56);
        force_general.add(ABDarrow12);
        var TXfaceNormal1 = createSpriteTextApply('n', number, new THREE.Vector3(endPtArrowABDb2.x, endPtArrowABDb2.y, endPtArrowABDb2.z + 0.1));
        force_general.add(TXfaceNormal1);
    }

    function drawForceNormals4(forcePtA, forcePtB, forcePtC, edgePt1, edgePt2, normal_apply, normal_apply_outline, number) {
        var forceFaceABDcenter = face_center(forcePtA, forcePtB, forcePtC)
        const endforceFaceABDa = subVecUpdated(edgePt1, edgePt2);
        var endforceFaceABDb = drawArrowfromVec(forceFaceABDcenter, endforceFaceABDa, -0.01)
        const endPtArrowABDb1 = addVectorAlongDir(forceFaceABDcenter, endforceFaceABDb, -0.01);
        const endPtArrowABDb2 = addVectorAlongDir(forceFaceABDcenter, endforceFaceABDb, -0.45);
        var ABDarrow1 = createCylinderArrowMesh(endPtArrowABDb2, endPtArrowABDb1, normal_apply, 0.02, 0.05, 0.56);
        force_general.add(ABDarrow1);
        var ABDarrow12 = createCylinderArrowMesh(endPtArrowABDb2, endPtArrowABDb1, normal_apply_outline, 0.025, 0.06, 0.56);
        force_general.add(ABDarrow12);
        var TXfaceNormal1 = createSpriteTextApply('n', number, new THREE.Vector3(endPtArrowABDb2.x, endPtArrowABDb2.y, endPtArrowABDb2.z + 0.1));
        force_general.add(TXfaceNormal1);
    }

    function drawForceNormals5(forcePtA, forcePtB, forcePtC, edgePt1, edgePt2, normal_apply, normal_apply_outline, number) {
        var forceFaceABDcenter = face_center(forcePtA, forcePtB, forcePtC)
        const endforceFaceABDa = subVecUpdated(edgePt1, edgePt2);
        var endforceFaceABDb = drawArrowfromVec(forceFaceABDcenter, endforceFaceABDa, -0.25)
        const endPtArrowABDb1 = addVectorAlongDir(forceFaceABDcenter, endforceFaceABDb, -0.01);
        const endPtArrowABDb2 = addVectorAlongDir(forceFaceABDcenter, endforceFaceABDb, -0.45);
        var ABDarrow1 = createCylinderArrowMesh(endPtArrowABDb2, endPtArrowABDb1, normal_apply, 0.02, 0.05, 0.56);
        force_general.add(ABDarrow1);
        var ABDarrow12 = createCylinderArrowMesh(endPtArrowABDb2, endPtArrowABDb1, normal_apply_outline, 0.025, 0.06, 0.56);
        force_general.add(ABDarrow12);
        var TXfaceNormal1 = createSpriteTextApply('n', number, new THREE.Vector3(endPtArrowABDb2.x, endPtArrowABDb2.y, endPtArrowABDb2.z + 0.1));
        force_general.add(TXfaceNormal1);
    }

    function drawForceNormals6(forcePtA, forcePtB, forcePtC, edgePt1, edgePt2, normal_apply, normal_apply_outline, number) {
        var forceFaceABDcenter = face_center(forcePtA, forcePtB, forcePtC)
        const endforceFaceABDa = subVecUpdated(edgePt1, edgePt2);
        var endforceFaceABDb = drawArrowfromVec(forceFaceABDcenter, endforceFaceABDa, -0.25)
        const endPtArrowABDb1 = addVectorAlongDir(forceFaceABDcenter, endforceFaceABDb, -0.01);
        const endPtArrowABDb2 = addVectorAlongDir(forceFaceABDcenter, endforceFaceABDb, -0.45);
        var ABDarrow1 = createCylinderArrowMesh(endPtArrowABDb1, endPtArrowABDb2, normal_apply, 0.02, 0.05, 0.56);
        force_general.add(ABDarrow1);
        var ABDarrow12 = createCylinderArrowMesh(endPtArrowABDb1, endPtArrowABDb2, normal_apply_outline, 0.025, 0.06, 0.56);
        force_general.add(ABDarrow12);
        var TXfaceNormal1 = createSpriteTextApply('n', number, new THREE.Vector3(endPtArrowABDb2.x, endPtArrowABDb2.y, endPtArrowABDb2.z + 0.1));
        force_general.add(TXfaceNormal1);
    }

// ************************  old arrow direction function (no use)  ************************


    // ************************  rewrite the normal arrow direction   ************************
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


    // define the arrow the direction

    // condition 1
    if (result1 < 0) {
        if (resultapply > 0) {
            if (areaABD / areaMax >= 0.75) {
                formedgeColor1 = 0x80002F
            }
            if (0.5 <= areaABD / areaMax && areaABD / areaMax < 0.75) {
                formedgeColor1 = 0x940041
            }
            if (0.25 <= areaABD / areaMax && areaABD / areaMax < 0.5) {
                formedgeColor1 = 0xCC0549
            }
            if (0 <= areaABD / areaMax && areaABD / areaMax < 0.25) {
                formedgeColor1 = 0xD72F62
            }
            var forceFaceABD = ForceFace3pt(forcePtA, forcePtB, forcePtD, formedgeColor1);

            var forceNormalMaterial = new THREE.MeshPhongMaterial({
                color: formedgeColor1
            });
            var forceNormalMaterialOutline = new THREE.MeshPhongMaterial({
                color: "white", transparent: false, side: THREE.BackSide

            });
            force_general.add(ForceFaceNormalsArrow(forcePtB, forcePtD, forcePtA, 0.4, forceNormalMaterial, forceNormalMaterialOutline, "1", true))
        } else {
            if (areaACD / areaMax >= 0.75) {
                formedgeColor1 = 0x80002F
            }
            if (0.5 <= areaACD / areaMax && areaACD / areaMax < 0.75) {
                formedgeColor1 = 0x940041
            }
            if (0.25 <= areaACD / areaMax && areaACD / areaMax < 0.5) {
                formedgeColor1 = 0xCC0549
            }
            if (0 <= areaACD / areaMax && areaACD / areaMax < 0.25) {
                formedgeColor1 = 0xD72F62
            }
            var forceFaceACD = ForceFace3pt(forcePtA, forcePtC, forcePtD, formedgeColor1);
            var forceNormalMaterial = new THREE.MeshPhongMaterial({
                color: formedgeColor1
            });
            var forceNormalMaterialOutline = new THREE.MeshPhongMaterial({
                color: "white", transparent: false, side: THREE.BackSide

            });
            force_general.add(ForceFaceNormalsArrow(forcePtA, forcePtD, forcePtC, 0.4, forceNormalMaterial, forceNormalMaterialOutline, "1", true))
        }
    } else {
        if (resultapply > 0) {
            if (areaABD / areaMax >= 0.75) {
                formedgeColor1 = 0x0F3150
            }
            if (0.5 <= areaABD / areaMax && areaABD / areaMax < 0.75) {
                formedgeColor1 = 0x05416D
            }
            if (0.25 <= areaABD / areaMax && areaABD / areaMax < 0.5) {
                formedgeColor1 = 0x376D9B
            }
            if (0 <= areaABD / areaMax && areaABD / areaMax < 0.25) {
                formedgeColor1 = 0x5B84AE
            }
            var forceFaceABD = ForceFace3pt(forcePtA, forcePtB, forcePtD, formedgeColor1);
            var forceNormalMaterial = new THREE.MeshPhongMaterial({
                color: formedgeColor1
            });
            var forceNormalMaterialOutline = new THREE.MeshPhongMaterial({
                color: "white", transparent: false, side: THREE.BackSide

            });
            force_general.add(ForceFaceNormalsArrow(forcePtB, forcePtD, forcePtA, 0.4, forceNormalMaterial, forceNormalMaterialOutline, "1", false))
        } else {
            if (areaACD / areaMax >= 0.75) {
                formedgeColor1 = 0x0F3150
            }
            if (0.5 <= areaACD / areaMax && areaACD / areaMax < 0.75) {
                formedgeColor1 = 0x05416D
            }
            if (0.25 <= areaACD / areaMax && areaACD / areaMax < 0.5) {
                formedgeColor1 = 0x376D9B
            }
            if (0 <= areaACD / areaMax && areaACD / areaMax < 0.25) {
                formedgeColor1 = 0x5B84AE
            }
            var forceFaceACD = ForceFace3pt(forcePtA, forcePtC, forcePtD, formedgeColor1);
            var forceNormalMaterial = new THREE.MeshPhongMaterial({
                color: formedgeColor1
            });
            var forceNormalMaterialOutline = new THREE.MeshPhongMaterial({
                color: "white", transparent: false, side: THREE.BackSide

            });
            force_general.add(ForceFaceNormalsArrow(forcePtA, forcePtD, forcePtC, 0.4, forceNormalMaterial, forceNormalMaterialOutline, "1", false))
        }
    }
    var formEdge1Material = new THREE.MeshPhongMaterial({
        color: formedgeColor1
    });


    if (result2 < 0) {
        if (resultapply > 0) {
            if (areaBCD / areaMax >= 0.75) {
                formedgeColor2 = 0x80002F
            }
            if (0.5 <= areaBCD / areaMax && areaBCD / areaMax < 0.75) {
                formedgeColor2 = 0x940041
            }
            if (0.25 <= areaBCD / areaMax && areaBCD / areaMax < 0.5) {
                formedgeColor2 = 0xCC0549
            }
            if (0 <= areaBCD / areaMax && areaBCD / areaMax < 0.25) {
                formedgeColor2 = 0xD72F62
            }
            var forceFaceBCD = ForceFace3pt(forcePtB, forcePtC, forcePtD, formedgeColor2);
            var forceNormalMaterial = new THREE.MeshPhongMaterial({
                color: formedgeColor2
            });
            var forceNormalMaterialOutline = new THREE.MeshPhongMaterial({
                color: "white", transparent: false, side: THREE.BackSide

            });
            force_general.add(ForceFaceNormalsArrow(forcePtB, forcePtC, forcePtD, 0.4, forceNormalMaterial, forceNormalMaterialOutline, "2", true))
        } else {
            if (areaBCD / areaMax >= 0.75) {
                formedgeColor2 = 0x80002F
            }
            if (0.5 <= areaBCD / areaMax && areaBCD / areaMax < 0.75) {
                formedgeColor2 = 0x940041
            }
            if (0.25 <= areaBCD / areaMax && areaBCD / areaMax < 0.5) {
                formedgeColor2 = 0xCC0549
            }
            if (0 <= areaBCD / areaMax && areaBCD / areaMax < 0.25) {
                formedgeColor2 = 0xD72F62
            }
            var forceFaceBCD = ForceFace3pt(forcePtB, forcePtC, forcePtD, formedgeColor2);
            var forceNormalMaterial = new THREE.MeshPhongMaterial({
                color: formedgeColor2
            });
            var forceNormalMaterialOutline = new THREE.MeshPhongMaterial({
                color: "white", transparent: false, side: THREE.BackSide

            });
            force_general.add(ForceFaceNormalsArrow(forcePtB, forcePtC, forcePtD, 0.4, forceNormalMaterial, forceNormalMaterialOutline, "2", true))
        }
    } else {
        if (resultapply > 0) {
            if (areaBCD / areaMax >= 0.75) {
                formedgeColor2 = 0x0F3150
            }
            if (0.5 <= areaBCD / areaMax && areaBCD / areaMax < 0.75) {
                formedgeColor2 = 0x05416D
            }
            if (0.25 <= areaBCD / areaMax && areaBCD / areaMax < 0.5) {
                formedgeColor2 = 0x376D9B
            }
            if (0 <= areaBCD / areaMax && areaBCD / areaMax < 0.25) {
                formedgeColor2 = 0x5B84AE
            }
            var forceFaceBCD = ForceFace3pt(forcePtB, forcePtC, forcePtD, formedgeColor2);
            var forceNormalMaterial = new THREE.MeshPhongMaterial({
                color: formedgeColor2
            });
            var forceNormalMaterialOutline = new THREE.MeshPhongMaterial({
                color: "white", transparent: false, side: THREE.BackSide

            });
            //var forceFaceNormalBCD = drawForceNormals2(forcePtB,forcePtC,forcePtD,formBtPt2[1], formBtPt1[0],forceNormalMaterial,forceNormalMaterialOutline,"2");
            if (forcePtD.z < 0) {
                force_general.add(ForceFaceNormalsArrow(forcePtB, forcePtC, forcePtD, 0.4, forceNormalMaterial, forceNormalMaterialOutline, "2", false))
            } else {
                force_general.add(ForceFaceNormalsArrow(forcePtB, forcePtC, forcePtD, 0.4, forceNormalMaterial, forceNormalMaterialOutline, "2", true))
            }

        } else {
            if (areaBCD / areaMax >= 0.75) {
                formedgeColor2 = 0x0F3150
            }
            if (0.5 <= areaBCD / areaMax && areaBCD / areaMax < 0.75) {
                formedgeColor2 = 0x05416D
            }
            if (0.25 <= areaBCD / areaMax && areaBCD / areaMax < 0.5) {
                formedgeColor2 = 0x376D9B
            }
            if (0 <= areaBCD / areaMax && areaBCD / areaMax < 0.25) {
                formedgeColor2 = 0x5B84AE
            }
            var forceFaceBCD = ForceFace3pt(forcePtB, forcePtC, forcePtD, formedgeColor2);
            var forceNormalMaterial = new THREE.MeshPhongMaterial({
                color: formedgeColor2
            });
            var forceNormalMaterialOutline = new THREE.MeshPhongMaterial({
                color: "white", transparent: false, side: THREE.BackSide

            });
            if (forcePtD.z < 0) {
                force_general.add(ForceFaceNormalsArrow(forcePtB, forcePtC, forcePtD, 0.4, forceNormalMaterial, forceNormalMaterialOutline, "2", false))
            } else {
                force_general.add(ForceFaceNormalsArrow(forcePtB, forcePtC, forcePtD, 0.4, forceNormalMaterial, forceNormalMaterialOutline, "2", true))
            }
        }
    }
    var formEdge2Material = new THREE.MeshPhongMaterial({
        color: formedgeColor2
    });


    if (result3 < 0) {
        if (resultapply > 0) {
            if (areaACD / areaMax >= 0.75) {
                formedgeColor3 = 0x80002F
            }
            if (0.5 <= areaACD / areaMax && areaACD / areaMax < 0.75) {
                formedgeColor3 = 0x940041
            }
            if (0.25 <= areaACD / areaMax && areaACD / areaMax < 0.5) {
                formedgeColor3 = 0xCC0549
            }
            if (0 <= areaACD / areaMax && areaACD / areaMax < 0.25) {
                formedgeColor3 = 0xD72F62
            }
            var forceFaceACD = ForceFace3pt(forcePtA, forcePtC, forcePtD, formedgeColor3);
            var forceNormalMaterial = new THREE.MeshPhongMaterial({
                color: formedgeColor3
            });
            var forceNormalMaterialOutline = new THREE.MeshPhongMaterial({
                color: "white", transparent: false, side: THREE.BackSide

            });
            force_general.add(ForceFaceNormalsArrow(forcePtA, forcePtD, forcePtC, 0.4, forceNormalMaterial, forceNormalMaterialOutline, "3", true))
        } else {
            if (areaABD / areaMax >= 0.75) {
                formedgeColor3 = 0x80002F
            }
            if (0.5 <= areaABD / areaMax && areaABD / areaMax < 0.75) {
                formedgeColor3 = 0x940041
            }
            if (0.25 <= areaABD / areaMax && areaABD / areaMax < 0.5) {
                formedgeColor3 = 0xCC0549
            }
            if (0 <= areaABD / areaMax && areaABD / areaMax < 0.25) {
                formedgeColor3 = 0xD72F62
            }
            var forceFaceABD = ForceFace3pt(forcePtA, forcePtB, forcePtD, formedgeColor3);
            var forceNormalMaterial = new THREE.MeshPhongMaterial({
                color: formedgeColor3
            });
            var forceNormalMaterialOutline = new THREE.MeshPhongMaterial({
                color: "white", transparent: false, side: THREE.BackSide

            });
            //force_general.add(ForceFaceNormalsArrow(forcePtA,forcePtB, forcePtD, 0.4, forceNormalMaterial,forceNormalMaterialOutline,"3", false))
            if (forcePtD.z < 0) {
                force_general.add(ForceFaceNormalsArrow(forcePtA, forcePtB, forcePtD, 0.4, forceNormalMaterial, forceNormalMaterialOutline, "3", false))
            } else {
                force_general.add(ForceFaceNormalsArrow(forcePtA, forcePtB, forcePtD, 0.4, forceNormalMaterial, forceNormalMaterialOutline, "3", true))
            }
        }

    } else {
        if (resultapply > 0) {
            if (areaACD / areaMax >= 0.75) {
                formedgeColor3 = 0x0F3150
            }
            if (0.5 <= areaACD / areaMax && areaACD / areaMax < 0.75) {
                formedgeColor3 = 0x05416D
            }
            if (0.25 <= areaACD / areaMax && areaACD / areaMax < 0.5) {
                formedgeColor3 = 0x376D9B
            }
            if (0 <= areaACD / areaMax && areaACD / areaMax < 0.25) {
                formedgeColor3 = 0x5B84AE
            }
            var forceFaceACD = ForceFace3pt(forcePtA, forcePtC, forcePtD, formedgeColor3);
            var forceNormalMaterial = new THREE.MeshPhongMaterial({
                color: formedgeColor3
            });
            var forceNormalMaterialOutline = new THREE.MeshPhongMaterial({
                color: "white", transparent: false, side: THREE.BackSide

            });
            if (forcePtD.z < 0) {
                force_general.add(ForceFaceNormalsArrow(forcePtA, forcePtD, forcePtC, 0.4, forceNormalMaterial, forceNormalMaterialOutline, "3", false))
            } else {
                force_general.add(ForceFaceNormalsArrow(forcePtA, forcePtD, forcePtC, 0.4, forceNormalMaterial, forceNormalMaterialOutline, "3", true))
            }

        } else {
            if (areaABD / areaMax >= 0.75) {
                formedgeColor3 = 0x0F3150
            }
            if (0.5 <= areaABD / areaMax && areaABD / areaMax < 0.75) {
                formedgeColor3 = 0x05416D
            }
            if (0.25 <= areaABD / areaMax && areaABD / areaMax < 0.5) {
                formedgeColor3 = 0x376D9B
            }
            if (0 <= areaABD / areaMax && areaABD / areaMax < 0.25) {
                formedgeColor3 = 0x5B84AE
            }
            var forceFaceABD = ForceFace3pt(forcePtA, forcePtB, forcePtD, formedgeColor3);
            var forceNormalMaterial = new THREE.MeshPhongMaterial({
                color: formedgeColor3
            });
            var forceNormalMaterialOutline = new THREE.MeshPhongMaterial({
                color: "white", transparent: false, side: THREE.BackSide

            });
            if (forcePtD.z < 0) {
                force_general.add(ForceFaceNormalsArrow(forcePtA, forcePtB, forcePtD, 0.4, forceNormalMaterial, forceNormalMaterialOutline, "3", false))
            } else {
                force_general.add(ForceFaceNormalsArrow(forcePtA, forcePtB, forcePtD, 0.4, forceNormalMaterial, forceNormalMaterialOutline, "3", true))
            }
        }

    }
    var formEdge3Material = new THREE.MeshPhongMaterial({
        color: formedgeColor3
    });


    force_group_f.add(forceFaceACD)
    force_group_f.add(forceFaceBCD)
    force_group_f.add(forceFaceABD)


    if (forcePtD.z < 0) {
        var TXapplyNormal = createSpriteTextApply('f', "1",
            new THREE.Vector3(
                face_center(forcePtA, forcePtB, forcePtC).x,
                face_center(forcePtA, forcePtB, forcePtC).y,
                face_center(forcePtA, forcePtB, forcePtC).z + 0.4));
    } else {
        var TXapplyNormal = createSpriteTextApply('f', "1",
            new THREE.Vector3(
                face_center(forcePtA, forcePtB, forcePtC).x,
                face_center(forcePtA, forcePtB, forcePtC).y,
                face_center(forcePtA, forcePtB, forcePtC).z - 0.5));
    }
    force_general.add(TXapplyNormal);


    //create end sphere for bottom vertice 1
    const endPtVertice1SpV = addVectorAlongDir(formBtPt1[1], formTpPt[0], -0.14);
    const endPtVertice1Sp = addEdgeSphere(edgeSize1, endPtVertice1SpV, formedgeColor1)
    //create edge bottom vertice 1
    const endPtVertice1 = addVectorAlongDir(formTpPt[0], formBtPt1[1], -0.1);
    const formEdge1 = createCylinderMesh(endPtVertice1SpV, endPtVertice1, formEdge1Material, edgeSize1, edgeSize1);


    form_group_e.add(endPtVertice1Sp)
    form_group_e.add(formEdge1)

    //create end sphere for bottom vertice 2
    const endPtVertice2SpV = addVectorAlongDir(formBtPt2[1], formTpPt[0], -0.14);
    const endPtVertice2Sp = addEdgeSphere(edgeSize2, endPtVertice2SpV, formedgeColor2)
    //create edge bottom vertice 2
    const endPtVertice2 = addVectorAlongDir(formTpPt[0], formBtPt2[1], -0.1);
    const formEdge2 = createCylinderMesh(endPtVertice2SpV, endPtVertice2, formEdge2Material, edgeSize2, edgeSize2);

    form_group_e.add(endPtVertice2Sp)
    form_group_e.add(formEdge2)

    //create end sphere for bottom vertice 3
    const endPtVertice3SpV = addVectorAlongDir(formBtPt3[1], formTpPt[0], -0.14);
    const endPtVertice3Sp = addEdgeSphere(edgeSize3, endPtVertice3SpV, formedgeColor3)
    //create edge bottom vertice 3
    const endPtVertice3 = addVectorAlongDir(formTpPt[0], formBtPt3[1], -0.1);
    const formEdge3 = createCylinderMesh(endPtVertice3SpV, endPtVertice3, formEdge3Material, edgeSize3, edgeSize3);

    form_group_e.add(endPtVertice3Sp)
    form_group_e.add(formEdge3)


    // ********************************** Minkowski Sum Generation ************************************



// ****************************************************** Steps Generation ********************************************************


    // add plan color edges
    var stepformEdgeMaterial = new THREE.MeshPhongMaterial({
        color: "grey"
    });
    var stepedgeSize = 0.02

    // edge 1
    //create end sphere for bottom vertice 1
    const stependPtVertice1SpV = addVectorAlongDir(formBtPt1[1], formTpPt[0], -0.14);
    const stependPtVertice1Sp = addEdgeSphere(stepedgeSize, stependPtVertice1SpV, "grey")
    //create edge bottom vertice 1
    const stependPtVertice1 = addVectorAlongDir(formTpPt[0], formBtPt1[1], -0.1);
    const stepformEdge1 = createCylinderMesh(stependPtVertice1SpV, stependPtVertice1, stepformEdgeMaterial, stepedgeSize, stepedgeSize);

    form_group_step.add(stependPtVertice1Sp)
    form_group_step.add(stepformEdge1)

    // edge 2
    //create end sphere for bottom vertice 2
    const stependPtVertice2SpV = addVectorAlongDir(formBtPt2[1], formTpPt[0], -0.14);
    const stependPtVertice2Sp = addEdgeSphere(stepedgeSize, stependPtVertice2SpV, "grey")
    //create edge bottom vertice 2
    const stependPtVertice2 = addVectorAlongDir(formTpPt[0], formBtPt2[1], -0.1);
    const stepformEdge2 = createCylinderMesh(stependPtVertice2SpV, stependPtVertice2, stepformEdgeMaterial, stepedgeSize, stepedgeSize);

    form_group_step.add(stependPtVertice2Sp)
    form_group_step.add(stepformEdge2)

    // edge 3
    //create end sphere for bottom vertice 3
    const stependPtVertice3SpV = addVectorAlongDir(formBtPt3[1], formTpPt[0], -0.14);
    const stependPtVertice3Sp = addEdgeSphere(stepedgeSize, stependPtVertice3SpV, "grey")
    //create edge bottom vertice 3
    const stependPtVertice3 = addVectorAlongDir(formTpPt[0], formBtPt3[1], -0.1);
    const stepformEdge3 = createCylinderMesh(stependPtVertice3SpV, stependPtVertice3, stepformEdgeMaterial, stepedgeSize, stepedgeSize);

    form_group_step.add(stependPtVertice3Sp)
    form_group_step.add(stepformEdge3)


// **************************************** step - 1 ********************************************
    // form - show the faces
    // force - nothing is showing

// **************************************** step - 2 ********************************************
    // form - faces are showing with cells
    // force - nothing is showing

// **************************************** step - 3 ********************************************
    // form - a. right hand rule circle arrow
    //        b. text A, B, C
    //        c. green faces (small)

    // force - a. sphere at A, B
    //         b. Text A, B
    //         c. arrow inbetween A and B
    //         d. dash line

    // ****************************     step - 3    ****************************

    // **************************** step - 3a force ****************************
    var StepForceVerticeA = addVerticeStep(0.03, "", forcePtA)
    force_group_step_3.add(StepForceVerticeA)

    var StepForceVerticeB = addVerticeStep(0.03, "", forcePtB)
    force_group_step_3.add(StepForceVerticeB)

    //add the arrow
    var normal_apply_step_3 = new THREE.MeshPhongMaterial({color: 0x009600});
    var force_normal_apply_step_3 = new THREE.MeshPhongMaterial({color: 0x009600});

    const forceABvec = subVecUpdated(forcePtB, forcePtA);
    var endforceABvec = drawArrowfromVec(forcePtA, forceABvec, 0.4)
    const endPtArrowAB1 = addVectorAlongDir(forcePtA, endforceABvec, 0.01);
    const endPtArrowAB2 = addVectorAlongDir(forcePtA, endforceABvec, 0.45);
    var ABarrow1 = createCylinderArrowMesh(endPtArrowAB1, endPtArrowAB2, force_normal_apply_step_3, 0.02, 0.045, 0.56);
    force_group_step_3.add(ABarrow1);

    var forceABline1 = createdashline(forcePtB, forcePtA, "grey")
    force_group_step_3.add(forceABline1)

    var StepForceTextA = createSpriteText('A', "", new THREE.Vector3(forcePtA.x, forcePtA.y, forcePtA.z + 0.05))
    force_group_step_3.add(StepForceTextA)
    var StepForceTextB = createSpriteText('B', "", new THREE.Vector3(forcePtB.x, forcePtB.y, forcePtB.z + 0.05))
    force_group_step_3.add(StepForceTextB)

    // **************************** step - 3b form ****************************
    // draw the circle
    const StepCirclegeometry = new THREE.CircleGeometry(0.6, 60);
    const StepCirclematerial = new THREE.MeshBasicMaterial({
        color: "grey",
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const StepCircle = new THREE.Mesh(StepCirclegeometry, StepCirclematerial);
    var StepCircleCenter = new THREE.Vector3(formTpPt[0].x, formTpPt[0].y, formTpPt[0].z + 0.3)
    StepCircle.position.copy(StepCircleCenter)
    form_group_step_3.add(StepCircle);

    // draw divider point 1
    // Find the vectors that represent the sides parallel to the base of the trapezoid.
    // Let's call the fourth point D(x, y, 0.3).

    // AB = (0,0,0.3) - (0,0,0) = (0,0,0.3)
    // AC = (1,-1,-1) - (0,0,0) = (1,-1,-1)

    // Find the vector CD by subtracting vector AB from vector AC:
    // CD = AC - AB = (1,-1,-1) - (0,0,0.3) = (1,-1,-1.3)

    // Add the vector CD to point B to find point D:
    // D(x, y, 0.3) = B + CD = (0,0,0.3) + (1,-1,-1.3) = (1, -1, -1)

    // Therefore, x = 1 and y = -1.


    // draw the faces from the divider points

    form_group_step_3.add(drawDivider(formTpPt[1], formTpPt[0], formBtPt1[1], StepCircleCenter, 0.6));
    //form_group_step_3.add( drawDivider(formTpPt[1], formTpPt[0], formBtPt2[1], StepCircleCenter, 0.6 ) );
    //form_group_step_3.add( drawDivider(formTpPt[1], formTpPt[0], formBtPt3[1], StepCircleCenter, 0.6 ) );

    var StepDividerPt1 = findDividerPt(formTpPt[1], formTpPt[0], formBtPt1[1], StepCircleCenter, 0.6)
    form_group_step_3.add(FormFace3ptGN(formTpPt[1], StepCircleCenter, StepDividerPt1))

    var StepDividerPt2 = findDividerPt(formTpPt[1], formTpPt[0], formBtPt2[1], StepCircleCenter, 0.6)
    //form_group_step_3.add(FormFace3ptGN(formTpPt[1], StepCircleCenter, StepDividerPt2))

    var StepDividerPt3 = findDividerPt(formTpPt[1], formTpPt[0], formBtPt3[1], StepCircleCenter, 0.6)
    //form_group_step_3.add(FormFace3ptGN(formTpPt[1], StepCircleCenter, StepDividerPt3))

    var StepApplyCircle = createCircleFaceArrowStep(
        formTpPt[1], 0.2, cross(subVecUpdated(forcePtA, forcePtB), subVecUpdated(forcePtB, forcePtC)), 0x009600)
    form_group_step_3.add(StepApplyCircle);

    //draw arrows

    var step3faceNormal1 = facenormal(formTpPt[1], StepDividerPt1, StepCircleCenter, 0.2)
    var ABarrow1Vect = new THREE.Vector3(step3faceNormal1.x + StepDividerPt1.x, step3faceNormal1.y + StepDividerPt1.y, step3faceNormal1.z + StepDividerPt1.z);
    var formABarrow1 = createCylinderArrowMesh(StepDividerPt1, ABarrow1Vect, normal_apply_step_3, 0.01, 0.02, 0.6);

    form_group_step_3.add(formABarrow1);

    // add text at divided space
    const formTextAvec = subVecUpdated(face_center(forcePtA, forcePtB, forcePtC), forcePtA);
    var endformTextAvec = drawArrowfromVec(StepCircleCenter, formTextAvec, 0.01)
    const formTextendPtA = addVectorAlongDir(StepCircleCenter, endformTextAvec, -0.5);
    var StepFormTextA = createSpriteText('A', "", new THREE.Vector3(formTextendPtA.x, formTextendPtA.y, formTextendPtA.z + 0.05))
    form_group_step_3.add(StepFormTextA)

    const formTextBvec = subVecUpdated(face_center(forcePtA, forcePtB, forcePtC), forcePtB);
    var endformTextBvec = drawArrowfromVec(StepCircleCenter, formTextBvec, 0.01)
    const formTextendPtB = addVectorAlongDir(StepCircleCenter, endformTextBvec, -0.5);
    var StepFormTextB = createSpriteText('B', "", new THREE.Vector3(formTextendPtB.x, formTextendPtB.y, formTextendPtB.z + 0.05))
    form_group_step_3.add(StepFormTextB)


    // ****************************     step - 4    ****************************

    // **************************** step - 4a force ****************************

    var StepForceVerticeC = addVerticeStep(0.03, "", forcePtC)
    force_group_step_4.add(StepForceVerticeC)

    var normal_apply_step_4 = new THREE.MeshPhongMaterial({color: 0x009600});
    var ABarrow1 = createCylinderArrowMesh(forcePtA, forcePtB, normal_apply_step_4, 0.02, 0.045, 0.86);
    force_group_step_4.add(ABarrow1);

    // var forceACline1 = createdashline (forcePtC,forcePtA, "grey")
    // force_group_step_4.add(forceACline1)

    // var forceBCline1 = createdashline (forcePtC,forcePtB, "grey")
    // force_group_step_4.add(forceBCline1)

    var StepForceTextC = createSpriteText('C', "", new THREE.Vector3(forcePtC.x, forcePtC.y, forcePtC.z + 0.05))
    force_group_step_4.add(StepForceTextC)
    force_group_step_4.add(FormFace3ptGN(forcePtA, forcePtB, forcePtC))

    const forceBCvec = subVecUpdated(forcePtC, forcePtB);
    var endforceBCvec = drawArrowfromVec(forcePtB, forceBCvec, 0.4)
    const endPtArrowBC1 = addVectorAlongDir(forcePtB, endforceBCvec, 0.01);
    const endPtArrowBC2 = addVectorAlongDir(forcePtB, endforceBCvec, 0.45);
    var BCarrow1 = createCylinderArrowMesh(endPtArrowBC1, endPtArrowBC2, normal_apply_step_4, 0.02, 0.045, 0.56);
    force_group_step_4.add(BCarrow1);

    const forceCAvec = subVecUpdated(forcePtA, forcePtC);
    var endforceCAvec = drawArrowfromVec(forcePtC, forceCAvec, 0.4)
    const endPtArrowCA1 = addVectorAlongDir(forcePtC, endforceCAvec, 0.01);
    const endPtArrowCA2 = addVectorAlongDir(forcePtC, endforceCAvec, 0.45);
    var CAarrow1 = createCylinderArrowMesh(endPtArrowCA1, endPtArrowCA2, normal_apply_step_4, 0.02, 0.045, 0.56);
    force_group_step_4.add(CAarrow1);

    var StepapplyForceArrowMaterial = new THREE.MeshPhongMaterial({
        color: 0x009600//green
    });

    var StepapplyForceArrowMaterialOut = new THREE.MeshPhongMaterial({
        color: "white",
        transparent: false,
        side: THREE.BackSide
    });

    if (forcePtD.z < 0) {
        const StepapplyArrow = createCylinderArrowMesh(
            new THREE.Vector3(
                face_center(forcePtA, forcePtB, forcePtC).x,
                face_center(forcePtA, forcePtB, forcePtC).y,
                face_center(forcePtA, forcePtB, forcePtC).z + 0.4), face_center(forcePtA, forcePtB, forcePtC), StepapplyForceArrowMaterial, 0.015, 0.04, 0.55);
        force_group_step_4.add(StepapplyArrow);
        const StepapplyArrowOut = createCylinderArrowMesh(new THREE.Vector3(
            face_center(forcePtA, forcePtB, forcePtC).x,
            face_center(forcePtA, forcePtB, forcePtC).y,
            face_center(forcePtA, forcePtB, forcePtC).z + 0.4), face_center(forcePtA, forcePtB, forcePtC), StepapplyForceArrowMaterialOut, 0.02, 0.045, 0.545);
        force_group_step_4.add(StepapplyArrowOut);
    } else {
        const StepapplyArrow = createCylinderArrowMesh(
            face_center(forcePtA, forcePtB, forcePtC),
            new THREE.Vector3(
                face_center(forcePtA, forcePtB, forcePtC).x,
                face_center(forcePtA, forcePtB, forcePtC).y,
                face_center(forcePtA, forcePtB, forcePtC).z - 0.4), StepapplyForceArrowMaterial, 0.015, 0.04, 0.55);
        force_group_step_4.add(StepapplyArrow);
        const StepapplyArrowOut = createCylinderArrowMesh(
            face_center(forcePtA, forcePtB, forcePtC),
            new THREE.Vector3(
                face_center(forcePtA, forcePtB, forcePtC).x,
                face_center(forcePtA, forcePtB, forcePtC).y,
                face_center(forcePtA, forcePtB, forcePtC).z - 0.4), StepapplyForceArrowMaterialOut, 0.02, 0.045, 0.545);
        force_group_step_4.add(StepapplyArrowOut);
    }

    // face ABC

    var stepABCarrow = createCircleFaceArrowStep(face_center(forcePtA, forcePtB, forcePtC), 0.15, cross(subVecUpdated(forcePtA, forcePtB), subVecUpdated(forcePtB, forcePtC)), "white")
    force_group_step_4.add(stepABCarrow);


    // **************************** step - 4b form ****************************

    form_group_step_4.add(drawDivider(formTpPt[1], formTpPt[0], formBtPt2[1], StepCircleCenter, 0.6));
    form_group_step_4.add(drawDivider(formTpPt[1], formTpPt[0], formBtPt3[1], StepCircleCenter, 0.6));


    form_group_step_4.add(FormFace3ptGN(formTpPt[1], StepCircleCenter, StepDividerPt2))

    form_group_step_4.add(FormFace3ptGN(formTpPt[1], StepCircleCenter, StepDividerPt3))


    // add arrow BC
    var step3faceNormal2 = facenormal(formTpPt[1], StepDividerPt2, StepCircleCenter, 0.2)
    var BCarrow1Vect = new THREE.Vector3(step3faceNormal2.x + StepDividerPt2.x, step3faceNormal2.y + StepDividerPt2.y, step3faceNormal2.z + StepDividerPt2.z);
    var formBCarrow1 = createCylinderArrowMesh(StepDividerPt2, BCarrow1Vect, normal_apply_step_4, 0.01, 0.02, 0.6);

    form_group_step_4.add(formBCarrow1);

    // add arrow CA
    var step3faceNormal3 = facenormal(formTpPt[1], StepDividerPt3, StepCircleCenter, 0.2)
    var CAarrow1Vect = new THREE.Vector3(step3faceNormal3.x + StepDividerPt3.x, step3faceNormal3.y + StepDividerPt3.y, step3faceNormal3.z + StepDividerPt3.z);
    var formCAarrow1 = createCylinderArrowMesh(StepDividerPt3, CAarrow1Vect, normal_apply_step_4, 0.01, 0.02, 0.6);

    form_group_step_4.add(formCAarrow1);

    // add the Text "c"
    const formTextCvec = subVecUpdated(face_center(forcePtA, forcePtB, forcePtC), forcePtC);
    var endformTextCvec = drawArrowfromVec(StepCircleCenter, formTextCvec, 0.01)
    const formTextendPtC = addVectorAlongDir(StepCircleCenter, endformTextCvec, -0.5);
    var StepFormTextC = createSpriteText('C', "", new THREE.Vector3(formTextendPtC.x, formTextendPtC.y, formTextendPtC.z + 0.05))
    form_group_step_4.add(StepFormTextC)


    // ****************************     step - 5    ****************************

    // **************************** step - 5a force ****************************

    // draw offseted triangle ABC
    var forcePtAOffset = addOffsetPt3V(forcePtA, forcePtB, forcePtC, 0.8);
    var forcePtBOffset = addOffsetPt3V(forcePtB, forcePtA, forcePtC, 0.8);
    var forcePtCOffset = addOffsetPt3V(forcePtC, forcePtA, forcePtB, 0.8);
    var normal_apply_step_5 = new THREE.MeshPhongMaterial({color: 0x009600});
    var step5ABarrow1 = createCylinderArrowMesh(forcePtAOffset, forcePtBOffset, normal_apply_step_5, 0.01, 0.025, 0.86);
    force_group_step_5.add(step5ABarrow1);
    var step5BCarrow1 = createCylinderArrowMesh(forcePtBOffset, forcePtCOffset, normal_apply_step_5, 0.01, 0.025, 0.86);
    force_group_step_5.add(step5BCarrow1);
    var step5CAarrow1 = createCylinderArrowMesh(forcePtCOffset, forcePtAOffset, normal_apply_step_5, 0.01, 0.025, 0.86);
    force_group_step_5.add(step5CAarrow1);

    force_group_step_5.add(FormFace3ptGN(forcePtAOffset, forcePtBOffset, forcePtCOffset))
    var step5ABCarrow = createCircleFaceArrowStep(face_center(forcePtA, forcePtB, forcePtC), 0.15, cross(subVecUpdated(forcePtA, forcePtB), subVecUpdated(forcePtB, forcePtC)), "white")
    force_group_step_5.add(step5ABCarrow);

    var Step5applyForceArrowMaterial = new THREE.MeshPhongMaterial({
        color: 0x009600//green
    });

    var Step5applyForceArrowMaterialOut = new THREE.MeshPhongMaterial({
        color: "white",
        transparent: false,
        side: THREE.BackSide
    });

    if (forcePtD.z < 0) {
        const StepapplyArrow = createCylinderArrowMesh(
            new THREE.Vector3(
                face_center(forcePtA, forcePtB, forcePtC).x,
                face_center(forcePtA, forcePtB, forcePtC).y,
                face_center(forcePtA, forcePtB, forcePtC).z + 0.4), face_center(forcePtA, forcePtB, forcePtC), Step5applyForceArrowMaterial, 0.015, 0.04, 0.55);
        force_group_step_5.add(StepapplyArrow);
        const StepapplyArrowOut = createCylinderArrowMesh(new THREE.Vector3(
            face_center(forcePtA, forcePtB, forcePtC).x,
            face_center(forcePtA, forcePtB, forcePtC).y,
            face_center(forcePtA, forcePtB, forcePtC).z + 0.4), face_center(forcePtA, forcePtB, forcePtC), Step5applyForceArrowMaterialOut, 0.02, 0.045, 0.545);
        force_group_step_5.add(StepapplyArrowOut);
    } else {
        const StepapplyArrow = createCylinderArrowMesh(
            face_center(forcePtA, forcePtB, forcePtC),
            new THREE.Vector3(
                face_center(forcePtA, forcePtB, forcePtC).x,
                face_center(forcePtA, forcePtB, forcePtC).y,
                face_center(forcePtA, forcePtB, forcePtC).z - 0.4), Step5applyForceArrowMaterial, 0.015, 0.04, 0.55);
        force_group_step_5.add(StepapplyArrow);
        const StepapplyArrowOut = createCylinderArrowMesh(
            face_center(forcePtA, forcePtB, forcePtC),
            new THREE.Vector3(
                face_center(forcePtA, forcePtB, forcePtC).x,
                face_center(forcePtA, forcePtB, forcePtC).y,
                face_center(forcePtA, forcePtB, forcePtC).z - 0.4), Step5applyForceArrowMaterialOut, 0.02, 0.045, 0.545);
        force_group_step_5.add(StepapplyArrowOut);
    }


    // draw offseted triangle ABD


    var forcePtAOffset2 = addOffsetPt3V(forcePtA, forcePtB, forcePtD, 0.8);
    var forcePtAOffset3 = addOffsetPt3V(forcePtA, forcePtC, forcePtD, 0.8);

    var forcePtBOffset2 = addOffsetPt3V(forcePtB, forcePtA, forcePtD, 0.8);
    var forcePtCOffset2 = addOffsetPt3V(forcePtC, forcePtA, forcePtD, 0.8);
    var forcePtDOffset = addOffsetPt3V(forcePtD, forcePtA, forcePtB, 0.8);
    var forcePtDOffset2 = addOffsetPt3V(forcePtD, forcePtA, forcePtC, 0.8);

    // var normal_side_step_5 =new THREE.MeshPhongMaterial( {color: "black"} );
    // var step5ABarrow2 = createCylinderArrowMesh( forcePtBOffset2,forcePtAOffset2,normal_side_step_5,0.01,0.025,0.86);
    // force_group_step_5.add(step5ABarrow2);
    // var step5BDarrow1 = createCylinderArrowMesh( forcePtAOffset2,forcePtDOffset,normal_side_step_5,0.01,0.025,0.86);
    // force_group_step_5.add(step5BDarrow1);
    // var step5DAarrow1 = createCylinderArrowMesh( forcePtDOffset,forcePtBOffset2,normal_side_step_5,0.01,0.025,0.86);
    // force_group_step_5.add(step5DAarrow1);

    // var step5ABDarrow = createCircleFaceArrowStep(face_center(forcePtAOffset2, forcePtBOffset2, forcePtDOffset), 0.15, cross(subVecUpdated(forcePtA, forcePtB),subVecUpdated(forcePtD, forcePtA)),"white")
    // force_group_step_5.add(step5ABDarrow);
    // if(forcePtD.z<0){
    //   var StepFormTextD = createSpriteText('D',"", new THREE.Vector3(forcePtDOffset.x, forcePtDOffset.y, forcePtDOffset.z-0.2))
    // } else{
    //   var StepFormTextD = createSpriteText('D',"", new THREE.Vector3(forcePtDOffset.x, forcePtDOffset.y, forcePtDOffset.z+0.05))
    // }
    // force_group_step_5.add(StepFormTextD)


    if (result1 < 0) {
        if (resultapply > 0) {

            var normal_side_step_5 = new THREE.MeshPhongMaterial({color: "black"});
            var step5ABarrow2 = createCylinderArrowMesh(forcePtBOffset2, forcePtAOffset2, normal_side_step_5, 0.01, 0.025, 0.86);
            force_group_step_5.add(step5ABarrow2);
            var step5BDarrow1 = createCylinderArrowMesh(forcePtAOffset2, forcePtDOffset, normal_side_step_5, 0.01, 0.025, 0.86);
            force_group_step_5.add(step5BDarrow1);
            var step5DAarrow1 = createCylinderArrowMesh(forcePtDOffset, forcePtBOffset2, normal_side_step_5, 0.01, 0.025, 0.86);
            force_group_step_5.add(step5DAarrow1);

            var step5ABDarrow = createCircleFaceArrowStep(face_center(forcePtAOffset2, forcePtBOffset2, forcePtDOffset), 0.15, cross(subVecUpdated(forcePtA, forcePtB), subVecUpdated(forcePtD, forcePtA)), "white")
            force_group_step_5.add(step5ABDarrow);
            if (forcePtD.z < 0) {
                var StepFormTextD = createSpriteText('D', "", new THREE.Vector3(forcePtDOffset.x, forcePtDOffset.y, forcePtDOffset.z - 0.2))
            } else {
                var StepFormTextD = createSpriteText('D', "", new THREE.Vector3(forcePtDOffset.x, forcePtDOffset.y, forcePtDOffset.z + 0.05))
            }
            force_group_step_5.add(StepFormTextD)
        } else {
            var normal_side_step_5 = new THREE.MeshPhongMaterial({color: "black"});
            var step5ABarrow2 = createCylinderArrowMesh(forcePtAOffset3, forcePtCOffset2, normal_side_step_5, 0.01, 0.025, 0.86);
            force_group_step_5.add(step5ABarrow2);
            var step5BDarrow1 = createCylinderArrowMesh(forcePtCOffset2, forcePtDOffset2, normal_side_step_5, 0.01, 0.025, 0.86);
            force_group_step_5.add(step5BDarrow1);
            var step5DAarrow1 = createCylinderArrowMesh(forcePtDOffset2, forcePtAOffset3, normal_side_step_5, 0.01, 0.025, 0.86);
            force_group_step_5.add(step5DAarrow1);

            var step5ABDarrow = createCircleFaceArrowStep(face_center(forcePtAOffset3, forcePtCOffset2, forcePtDOffset2), 0.15, cross(subVecUpdated(forcePtC, forcePtA), subVecUpdated(forcePtD, forcePtC)), "white")
            force_group_step_5.add(step5ABDarrow);
            if (forcePtD.z < 0) {
                var StepFormTextD = createSpriteText('D', "", new THREE.Vector3(forcePtDOffset2.x, forcePtDOffset2.y, forcePtDOffset2.z - 0.2))
            } else {
                var StepFormTextD = createSpriteText('D', "", new THREE.Vector3(forcePtDOffset2.x, forcePtDOffset2.y, forcePtDOffset2.z + 0.05))
            }
            force_group_step_5.add(StepFormTextD)
        }
    } else {
        if (resultapply > 0) {
            var normal_side_step_5 = new THREE.MeshPhongMaterial({color: "black"});
            var step5ABarrow2 = createCylinderArrowMesh(forcePtBOffset2, forcePtAOffset2, normal_side_step_5, 0.01, 0.025, 0.86);
            force_group_step_5.add(step5ABarrow2);
            var step5BDarrow1 = createCylinderArrowMesh(forcePtAOffset2, forcePtDOffset, normal_side_step_5, 0.01, 0.025, 0.86);
            force_group_step_5.add(step5BDarrow1);
            var step5DAarrow1 = createCylinderArrowMesh(forcePtDOffset, forcePtBOffset2, normal_side_step_5, 0.01, 0.025, 0.86);
            force_group_step_5.add(step5DAarrow1);

            var step5ABDarrow = createCircleFaceArrowStep(face_center(forcePtAOffset2, forcePtBOffset2, forcePtDOffset), 0.15, cross(subVecUpdated(forcePtA, forcePtB), subVecUpdated(forcePtD, forcePtA)), "white")
            force_group_step_5.add(step5ABDarrow);
            if (forcePtD.z < 0) {
                var StepFormTextD = createSpriteText('D', "", new THREE.Vector3(forcePtDOffset.x, forcePtDOffset.y, forcePtDOffset.z - 0.2))
            } else {
                var StepFormTextD = createSpriteText('D', "", new THREE.Vector3(forcePtDOffset.x, forcePtDOffset.y, forcePtDOffset.z + 0.05))
            }
            force_group_step_5.add(StepFormTextD)
        } else {
            var normal_side_step_5 = new THREE.MeshPhongMaterial({color: "black"});
            var step5ABarrow2 = createCylinderArrowMesh(forcePtAOffset3, forcePtCOffset2, normal_side_step_5, 0.01, 0.025, 0.86);
            force_group_step_5.add(step5ABarrow2);
            var step5BDarrow1 = createCylinderArrowMesh(forcePtCOffset2, forcePtDOffset2, normal_side_step_5, 0.01, 0.025, 0.86);
            force_group_step_5.add(step5BDarrow1);
            var step5DAarrow1 = createCylinderArrowMesh(forcePtDOffset2, forcePtAOffset3, normal_side_step_5, 0.01, 0.025, 0.86);
            force_group_step_5.add(step5DAarrow1);

            var step5ABDarrow = createCircleFaceArrowStep(face_center(forcePtAOffset3, forcePtCOffset2, forcePtDOffset2), 0.15, cross(subVecUpdated(forcePtC, forcePtA), subVecUpdated(forcePtD, forcePtC)), "white")
            force_group_step_5.add(step5ABDarrow);
            if (forcePtD.z < 0) {
                var StepFormTextD = createSpriteText('D', "", new THREE.Vector3(forcePtDOffset2.x, forcePtDOffset2.y, forcePtDOffset2.z - 0.2))
            } else {
                var StepFormTextD = createSpriteText('D', "", new THREE.Vector3(forcePtDOffset2.x, forcePtDOffset2.y, forcePtDOffset2.z + 0.05))
            }
            force_group_step_5.add(StepFormTextD)
        }
    }


    // **************************** step - 5b form ****************************

    var stepCircle2Center = new THREE.Vector3()
    var step5circleSp = new THREE.Sphere(new THREE.Vector3(formBtPt1[1].x, formBtPt1[1].y, formBtPt1[1].z), 0.8);
    step5circleSp.clampPoint(formBtPt1[0], stepCircle2Center);

    const StepCirclegeometry2 = new THREE.CircleGeometry(0.6, 60);
    const StepCirclematerial2 = new THREE.MeshBasicMaterial({
        color: "grey",
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const StepCircle2 = new THREE.Mesh(StepCirclegeometry2, StepCirclematerial2);
    StepCircle2.position.copy(stepCircle2Center)
    form_group_step_5.add(StepCircle2);

    // **************** find the circle rotation (step 5) **************** important *****************

    var step5TpClosestPt = new THREE.Vector3()
    var step5TopSp = new THREE.Sphere(new THREE.Vector3(formTpPt[1].x, formTpPt[1].y, formTpPt[1].z), 0.75);
    step5TopSp.clampPoint(formTpPt[0], step5TpClosestPt);

    var step5BtClosestPt = new THREE.Vector3()
    var step5BtSp = new THREE.Sphere(new THREE.Vector3(formTpPt[1].x, formTpPt[1].y, formTpPt[1].z), 0.9);
    step5BtSp.clampPoint(formBtPt1[1], step5BtClosestPt);


    var nn13 = facenormal(formTpPt[1], step5BtClosestPt, step5TpClosestPt, 0.2)

    var p5 = new THREE.Vector3(step5TpClosestPt.x, step5TpClosestPt.y, step5TpClosestPt.z);
    var p6 = new THREE.Vector3(formBtPt1[1].x, formBtPt1[1].y, step5TpClosestPt.z);

    var l4 = distanceVector(p5, p6);
    var pt_t3 = new THREE.Vector3(
        (step5TpClosestPt.x + (0.5 / (l4 - 0.5)) * formBtPt1[1].x) / (1 + 0.5 / (l4 - 0.5)),
        (step5TpClosestPt.y + (0.5 / (l4 - 0.5)) * formBtPt1[1].y) / (1 + 0.5 / (l4 - 0.5)),
        (step5TpClosestPt.z + (0.5 / (l4 - 0.5)) * step5TpClosestPt.z) / (1 + 0.5 / (l4 - 0.5))
    );

    var new1 = new THREE.Vector3(nn13.x + pt_t3.x, nn13.y + pt_t3.y, nn13.z + pt_t3.z);
    var vecab = new THREE.Vector3(new1.x - pt_t3.x, new1.y - pt_t3.y, new1.z - pt_t3.z);

    var Point_step_2_12 = new THREE.Vector3()
    var Sphere_step_2_12 = new THREE.Sphere(new THREE.Vector3(formBtPt1[1].x, formBtPt1[1].y, formBtPt1[1].z), 0.8);
    Sphere_step_2_12.clampPoint(formBtPt1[0], Point_step_2_12);

    var p3 = new THREE.Vector3(formBtPt1[1].x, formBtPt1[1].y, Point_step_2_12.z);
    var p4 = new THREE.Vector3(Point_step_2_12.x, Point_step_2_12.y, Point_step_2_12.z);

    var l3 = distanceVector(p3, p4);
    var pt_t2 = new THREE.Vector3(
        (Point_step_2_12.x + (0.5 / (l3 - 0.5)) * formBtPt1[1].x) / (1 + 0.5 / (l3 - 0.5)),
        (Point_step_2_12.y + (0.5 / (l3 - 0.5)) * formBtPt1[1].y) / (1 + 0.5 / (l3 - 0.5)),
        (Point_step_2_12.z + (0.5 / (l3 - 0.5)) * Point_step_2_12.z) / (1 + 0.5 / (l3 - 0.5))
    );

    var vec_2a = new THREE.Vector3(pt_t2.x - Point_step_2_12.x, pt_t2.y - Point_step_2_12.y, pt_t2.z - Point_step_2_12.z);
    var vec_2b = new THREE.Vector3(formBtPt1[1].x - Point_step_2_12.x, formBtPt1[1].y - Point_step_2_12.y, formBtPt1[1].z - Point_step_2_12.z);

    var an1 = vec_2a.angleTo(vec_2b);
    if (formBtPt1[1].z <= 0) {
        rotateAroundObjectAxis(StepCircle2, vecab, Math.PI / 2 - an1)
    }
    if (formBtPt1[1].z > 0) {
        rotateAroundObjectAxis(StepCircle2, vecab, Math.PI / 2 + an1)
    }

    //**************** draw the dividers in the second circle (step 5) ****************

    // divider - 1
    var f1 = new THREE.Vector3(formBtPt1[1].x, formBtPt1[1].y, formBtPt1[1].z);
    var f2 = new THREE.Vector3(formBtPt3[1].x, formBtPt3[1].y, formBtPt3[1].z);
    var fn = new THREE.Vector3().crossVectors(f1, f2);
    var f3 = new THREE.Vector3().crossVectors(fn, f1);
    var q = Math.sqrt(0.6 * 0.6 / (f3.x * f3.x + f3.y * f3.y + f3.z * f3.z));

    var mf = new THREE.Vector3(Point_step_2_12.x + q * f3.x, Point_step_2_12.y + q * f3.y, Point_step_2_12.z + q * f3.z);

    var spacedivide_geo21 = createCylinderMesh(Point_step_2_12, mf, new THREE.MeshPhongMaterial({
        color: "white",
        transparent: true,
        opacity: 0.6
    }), 0.008, 0.008);
    form_group_step_5.add(spacedivide_geo21);

    // divider - 2
    var f12 = new THREE.Vector3(formBtPt1[1].x, formBtPt1[1].y, formBtPt1[1].z);
    var f22 = new THREE.Vector3(formTpPt[1].x, formTpPt[1].y, formTpPt[1].z);
    var fn2 = new THREE.Vector3().crossVectors(f12, f22);
    var f32 = new THREE.Vector3().crossVectors(fn2, f12);
    var q = Math.sqrt(0.6 * 0.6 / (f32.x * f32.x + f32.y * f32.y + f32.z * f32.z));

    var mf2 = new THREE.Vector3(Point_step_2_12.x + q * f32.x, Point_step_2_12.y + q * f32.y, Point_step_2_12.z + q * f32.z);
    var spacedivide_geo22 = createCylinderMesh(Point_step_2_12, mf2, new THREE.MeshPhongMaterial({
        color: "white",
        transparent: true,
        opacity: 0.6
    }), 0.008, 0.008);
    form_group_step_5.add(spacedivide_geo22);

    // divider - 3
    var f13 = new THREE.Vector3(formBtPt1[1].x, formBtPt1[1].y, formBtPt1[1].z);
    var f23 = new THREE.Vector3(formBtPt2[1].x, formBtPt2[1].y, formBtPt2[1].z);
    var fn3 = new THREE.Vector3().crossVectors(f13, f23);
    var f33 = new THREE.Vector3().crossVectors(fn3, f13);
    var q = Math.sqrt(0.6 * 0.6 / (f33.x * f33.x + f33.y * f33.y + f33.z * f33.z));

    var mf3 = new THREE.Vector3(Point_step_2_12.x + q * f33.x, Point_step_2_12.y + q * f33.y, Point_step_2_12.z + q * f33.z);
    var spacedivide_geo23 = createCylinderMesh(Point_step_2_12, mf3, new THREE.MeshPhongMaterial({
        color: "white",
        transparent: true,
        opacity: 0.6
    }), 0.008, 0.008);
    form_group_step_5.add(spacedivide_geo23);

    // draw the faces for the divider
    form_group_step_5.add(FormFace3ptGN(formBtPt1[1], stepCircle2Center, mf2))
    form_group_step_5.add(FormFace3ptGR(formBtPt1[1], stepCircle2Center, mf))
    form_group_step_5.add(FormFace3ptGR(formBtPt1[1], stepCircle2Center, mf3))

    var normal_side_step_5 = new THREE.MeshPhongMaterial({color: "black"});
    // draw arrow BA
    var nn = facenormal(Point_step_2_12, formBtPt1[1], mf2, 0.2);
    var new1 = new THREE.Vector3(nn.x + mf2.x, nn.y + mf2.y, nn.z + mf2.z);
    var spacedivide_geo2a1 = createCylinderArrowMesh(mf2, new1, normal_side_step_5, 0.01, 0.02, 0.6);

    form_group_step_5.add(spacedivide_geo2a1);

    // draw arrow AD
    var nn2 = facenormal(Point_step_2_12, formBtPt1[1], mf, 0.2);
    var new2 = new THREE.Vector3(nn2.x + mf.x, nn2.y + mf.y, nn2.z + mf.z);
    var spacedivide_geo2a2 = createCylinderArrowMesh(mf, new2, normal_side_step_5, 0.01, 0.02, 0.6);

    form_group_step_5.add(spacedivide_geo2a2);

    // draw arrow DB
    var nn3 = facenormal(Point_step_2_12, formBtPt1[1], mf3, 0.2);
    var new3 = new THREE.Vector3(nn3.x + mf3.x, nn3.y + mf3.y, nn3.z + mf3.z);
    var spacedivide_geo2a3 = createCylinderArrowMesh(mf3, new3, normal_side_step_5, 0.01, 0.02, 0.6);

    form_group_step_5.add(spacedivide_geo2a3);

    // add the text "A"
    var sta = new THREE.Vector3((mf2.x + mf.x) / 2, (mf2.y + mf.y) / 2, (mf2.z + mf.z) / 2);
    var oldl = Point_step_2_12.distanceTo(sta);
    var c = new THREE.Vector3((Point_step_2_12.x + (sta.x - Point_step_2_12.x) * 0.5 / oldl), (Point_step_2_12.y + (sta.y - Point_step_2_12.y) * 0.5 / oldl), (Point_step_2_12.z + (sta.z - Point_step_2_12.z) * 0.5 / oldl));

    var TXMeshST21 = createSpriteText("A", "", c);
    form_group_step_5.add(TXMeshST21);

    // add the text "D"
    var sta2 = new THREE.Vector3((mf.x + mf3.x) / 2, (mf.y + mf3.y) / 2, (mf.z + mf3.z) / 2);
    var oldl2 = Point_step_2_12.distanceTo(sta2);
    var c2 = new THREE.Vector3((Point_step_2_12.x + (sta2.x - Point_step_2_12.x) * 0.5 / oldl2), (Point_step_2_12.y + (sta2.y - Point_step_2_12.y) * 0.5 / oldl2), (Point_step_2_12.z + (sta2.z - Point_step_2_12.z) * 0.5 / oldl2));

    var TXMeshST22 = createSpriteText("D", "", c2);
    form_group_step_5.add(TXMeshST22);

    // add the text "B"
    var sta3 = new THREE.Vector3((mf2.x + mf3.x) / 2, (mf2.y + mf3.y) / 2, (mf2.z + mf3.z) / 2);
    var oldl3 = Point_step_2_12.distanceTo(sta3);
    var c3 = new THREE.Vector3((Point_step_2_12.x + (sta3.x - Point_step_2_12.x) * 0.5 / oldl3), (Point_step_2_12.y + (sta3.y - Point_step_2_12.y) * 0.5 / oldl3), (Point_step_2_12.z + (sta3.z - Point_step_2_12.z) * 0.5 / oldl3));

    var TXMeshST23 = createSpriteText("B", "", c3);
    form_group_step_5.add(TXMeshST23);

    // **************************** step - 6a force ****************************
    // add the arrow for the edge under construction (using the normal setup of the arrow)

    if (result1 < 0) {
        if (resultapply > 0) {
            if (areaABD / areaMax >= 0.75) {
                formedgeColor1 = 0x80002F
            }
            if (0.5 <= areaABD / areaMax && areaABD / areaMax < 0.75) {
                formedgeColor1 = 0x940041
            }
            if (0.25 <= areaABD / areaMax && areaABD / areaMax < 0.5) {
                formedgeColor1 = 0xCC0549
            }
            if (0 <= areaABD / areaMax && areaABD / areaMax < 0.25) {
                formedgeColor1 = 0xD72F62
            }
            var stepforceFaceABD = ForceFace3pt(forcePtAOffset2, forcePtBOffset2, forcePtDOffset, formedgeColor1);
            force_group_step_6.add(stepforceFaceABD);
            var stepforceNormalMaterial = new THREE.MeshPhongMaterial({
                color: formedgeColor1
            });
            var stepforceNormalMaterialOutline = new THREE.MeshPhongMaterial({
                color: "white", transparent: false, side: THREE.BackSide

            });
            force_group_step_6.add(ForceFaceNormalsArrow(forcePtBOffset2, forcePtDOffset, forcePtAOffset2, 0.4, stepforceNormalMaterial, stepforceNormalMaterialOutline, "1", true))
        } else {
            if (areaACD / areaMax >= 0.75) {
                formedgeColor1 = 0x80002F
            }
            if (0.5 <= areaACD / areaMax && areaACD / areaMax < 0.75) {
                formedgeColor1 = 0x940041
            }
            if (0.25 <= areaACD / areaMax && areaACD / areaMax < 0.5) {
                formedgeColor1 = 0xCC0549
            }
            if (0 <= areaACD / areaMax && areaACD / areaMax < 0.25) {
                formedgeColor1 = 0xD72F62
            }
            var stepforceFaceACD = ForceFace3pt(forcePtAOffset3, forcePtCOffset2, forcePtDOffset2, formedgeColor1);
            force_group_step_6.add(stepforceFaceACD);
            var stepforceNormalMaterial = new THREE.MeshPhongMaterial({
                color: formedgeColor1
            });
            var stepforceNormalMaterialOutline = new THREE.MeshPhongMaterial({
                color: "white", transparent: false, side: THREE.BackSide

            });
            force_group_step_6.add(ForceFaceNormalsArrow(forcePtAOffset3, forcePtDOffset2, forcePtCOffset2, 0.4, stepforceNormalMaterial, stepforceNormalMaterialOutline, "1", true))
        }
    } else {
        if (resultapply > 0) {
            if (areaABD / areaMax >= 0.75) {
                formedgeColor1 = 0x0F3150
            }
            if (0.5 <= areaABD / areaMax && areaABD / areaMax < 0.75) {
                formedgeColor1 = 0x05416D
            }
            if (0.25 <= areaABD / areaMax && areaABD / areaMax < 0.5) {
                formedgeColor1 = 0x376D9B
            }
            if (0 <= areaABD / areaMax && areaABD / areaMax < 0.25) {
                formedgeColor1 = 0x5B84AE
            }
            var stepforceFaceABD = ForceFace3pt(forcePtAOffset2, forcePtBOffset2, forcePtDOffset, formedgeColor1);
            force_group_step_6.add(stepforceFaceABD);

            var stepforceNormalMaterial = new THREE.MeshPhongMaterial({
                color: formedgeColor1
            });
            var stepforceNormalMaterialOutline = new THREE.MeshPhongMaterial({
                color: "white", transparent: false, side: THREE.BackSide

            });
            force_group_step_6.add(ForceFaceNormalsArrow(forcePtBOffset2, forcePtDOffset, forcePtAOffset2, 0.4, stepforceNormalMaterial, stepforceNormalMaterialOutline, "1", false))
        } else {
            if (areaACD / areaMax >= 0.75) {
                formedgeColor1 = 0x0F3150
            }
            if (0.5 <= areaACD / areaMax && areaACD / areaMax < 0.75) {
                formedgeColor1 = 0x05416D
            }
            if (0.25 <= areaACD / areaMax && areaACD / areaMax < 0.5) {
                formedgeColor1 = 0x376D9B
            }
            if (0 <= areaACD / areaMax && areaACD / areaMax < 0.25) {
                formedgeColor1 = 0x5B84AE
            }
            var stepforceFaceACD = ForceFace3pt(forcePtAOffset3, forcePtCOffset2, forcePtDOffset2, formedgeColor1);
            force_group_step_6.add(stepforceFaceACD);

            var stepforceNormalMaterial = new THREE.MeshPhongMaterial({
                color: formedgeColor1
            });
            var stepforceNormalMaterialOutline = new THREE.MeshPhongMaterial({
                color: "white", transparent: false, side: THREE.BackSide

            });
            force_group_step_6.add(ForceFaceNormalsArrow(forcePtAOffset3, forcePtDOffset2, forcePtCOffset2, 0.4, stepforceNormalMaterial, stepforceNormalMaterialOutline, "1", false))
        }
    }
    var stepformEdge1Material = new THREE.MeshPhongMaterial({
        color: formedgeColor1
    });
    //create end sphere for bottom vertice 1
    const step6endPtVertice1SpV = addVectorAlongDir(formBtPt1[1], formTpPt[0], -0.14);
    const step6endPtVertice1Sp = addEdgeSphere(edgeSize1, step6endPtVertice1SpV, formedgeColor1)
    //create edge bottom vertice 1
    const step6endPtVertice1 = addVectorAlongDir(formTpPt[0], formBtPt1[1], -0.1);
    const step6formEdge1 = createCylinderMesh(step6endPtVertice1SpV, step6endPtVertice1, stepformEdge1Material, edgeSize1, edgeSize1);


    form_group_step_6.add(step6endPtVertice1Sp)
    form_group_step_6.add(step6formEdge1)


    //functions related to draw circle perpendicular to edge
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

    function distanceVector(v1, v2) {
        var dx = v1.x - v2.x;
        var dy = v1.y - v2.y;
        var dz = v1.z - v2.z;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    function rotateAroundObjectAxis(object, axis, radians) {
        var rotObjectMatrix = new THREE.Matrix4();
        rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

        // old code for Three.JS pre r54:
        // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
        // new code for Three.JS r55+:
        object.matrix.multiply(rotObjectMatrix);

        // old code for Three.js pre r49:
        // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
        // old code for Three.js r50-r58:
        // object.rotation.setEulerFromRotationMatrix(object.matrix);
        // new code for Three.js r59+:
        object.rotation.setFromRotationMatrix(object.matrix);
    }


    // visual of the elements

    // hide the steps - start from step general

    if (stepVisibilityCheckboxParams.steps) {
        redrawCell();
    }

    // hide the steps - start from step 3

    force_group_step_3.traverse(function (obj) {
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

    form_group_step_3.traverse(function (obj) {
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

    // hide the steps - start from step 4

    force_group_step_4.traverse(function (obj) {
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

    form_group_step_4.traverse(function (obj) {
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

    // hide the steps - start from step 5

    force_group_step_5.traverse(function (obj) {
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

    form_group_step_5.traverse(function (obj) {
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


    // hide the steps - start from step 6
    force_group_step_6.traverse(function (obj) {
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

    form_group_step_6.traverse(function (obj) {
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

    redrawStep();

    if (minkVisibilityCheckboxParams.show) {
        redrawMink();
    }

    scene.add(form_group_v);
    scene.add(form_group_e);
    scene.add(form_general);

    scene.add(form_group_step);
    scene.add(form_group_step_3);
    scene.add(form_group_step_4);
    scene.add(form_group_step_5);
    scene.add(form_group_step_6);
    scene.add(form_group_step_7);

    scene2.add(force_group_f);
    scene2.add(force_group_e);
    scene2.add(force_group_c);
    scene2.add(force_general);

    scene2.add(force_group_step);
    scene2.add(force_group_step_3);
    scene2.add(force_group_step_4);
    scene2.add(force_group_step_5);
    scene2.add(force_group_step_6);
    scene2.add(force_group_step_7);


}


function initModel() {
    Redraw();
    trfm_ctrl = new THREE.TransformControls(camera, renderer.domElement);

    trfm_ctrl.addEventListener('change', render);

    // transform control operations
    trfm_ctrl.addEventListener('objectChange', function () {
        switch(selectObj.name.charAt(2)) {
            case '1':
                formBtPt1[1].x = selectObj.position.x;
                formBtPt1[1].y = selectObj.position.y;
                formBtPt1[1].z = selectObj.position.z;
                break;
            case '2':
                formBtPt2[1].x = selectObj.position.x;
                formBtPt2[1].y = selectObj.position.y;
                formBtPt2[1].z = selectObj.position.z;
                break;
            case '3':
                formBtPt3[1].x = selectObj.position.x;
                formBtPt3[1].y = selectObj.position.y;
                formBtPt3[1].z = selectObj.position.z;
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

        if (event.button === 0 && intersects[0]  && !stepVisibilityCheckboxParams.steps) {
            selectObj = intersects[0].object;
            trfm_ctrl.attach(selectObj);
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

        if (intersects.length > 0  && !stepVisibilityCheckboxParams.steps) {
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
var intersects;

//rendering the scenes
function render() {

    let ctrlMin = new THREE.Vector3(-2, -2, -2);
    let ctrlMax = new THREE.Vector3(2, 2, 2);

    if (selectObj != null) {
        selectObj.position.clamp(ctrlMin, ctrlMax);
        trfm_ctrl.position.clamp(ctrlMin, ctrlMax);
    }

    //var rayCaster=new THREE.Raycaster();
    rayCaster.setFromCamera(mouse, camera);
    intersects = rayCaster.intersectObjects(Ctrl_pts);

    if (intersects.length > 0  && !stepVisibilityCheckboxParams.steps) {//有相交的object时

        if (INTERSECTED != intersects[0].object) {

            if (INTERSECTED) //
            {
                INTERSECTED.material.color.setHex(INTERSECTED.currentHex);

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


function create_force_face_area(point1, point2, pointO) {
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

function addVec(n1, n2) {
    var sub = new THREE.Vector3(0, 0, 0);
    sub.x = n1.x + n2.x;
    sub.y = n1.y + n2.y;
    sub.z = n1.z + n2.z;
    return sub;
}

function drawArrowfromVec(startPt, endPt, length) {
    //var vector = new THREE.Vector3();
    return new THREE.Vector3(startPt.x - length * endPt.x, startPt.y - length * endPt.y, startPt.z - length * endPt.z)
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

function addVerticeStep(size, name, location) {
    var pt_material = new THREE.MeshPhongMaterial({color: "green", transparent: false});
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
            color: 0x808080, transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false
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

function addOffsetPt3V(point1, point2, point3, scale) {

    var centroid = new THREE.Vector3((point1.x + point2.x + point3.x) / 3, (point1.y + point2.y + point3.y) / 3, (point1.z + point2.z + point3.z) / 3);
    return new THREE.Vector3(centroid.x + (point1.x - centroid.x) * scale, centroid.y + (point1.y - centroid.y) * scale, centroid.z + (point1.z - centroid.z) * scale)
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

function createdashline(point1, point2, color) {

    var dashline = [];
    dashline.push(point1);
    dashline.push(point2);


    var dashline_geo = new THREE.BufferGeometry().setFromPoints(dashline);

    var trialline_dash = new THREE.LineDashedMaterial({
        color: color,//color
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
        dashSize: 0.0, // temp fix
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

function createCircleFaceArrowStep(centerPt, radius, arr_dir, color) {
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
        dashSize: 0.0, // temp fix
        gapSize: 0.05
    });
    var CircleMesh = new THREE.Line(geometrySpacedPoints, arcMaterial);
    //console.log("points=",points[1],points[5]);
    CircleMesh.computeLineDistances();//dash
    var arrow_material1 = new THREE.MeshPhongMaterial({
        color: color
        //0x009600//green
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

function drawDivider(TopPt, midPt, btPt, circlecenter, radius) {
    var stepDiviPt1 = addVec(subVecUpdated(
        subVecUpdated(TopPt, midPt), subVecUpdated(midPt, btPt)
    ), circlecenter)
    stepDiviPt1.z = midPt.z + 0.3

    const stepDiviPt1vec = subVecUpdated(stepDiviPt1, circlecenter);
    var divilen1 = Math.sqrt(radius * radius / (stepDiviPt1vec.x * stepDiviPt1vec.x + stepDiviPt1vec.y * stepDiviPt1vec.y + stepDiviPt1vec.z * stepDiviPt1vec.z));
    var stepDiviPt1end = drawArrowfromVec(circlecenter, stepDiviPt1vec, divilen1)
    return createCylinderMesh(
        circlecenter,
        stepDiviPt1end,
        new THREE.MeshPhongMaterial({color: "white", transparent: true, opacity: 0.6}), 0.008, 0.008)
}

function findDividerPt(TopPt, midPt, btPt, circlecenter, radius) {
    var stepDiviPt1 = addVec(subVecUpdated(
        subVecUpdated(TopPt, midPt), subVecUpdated(midPt, btPt)
    ), circlecenter)
    stepDiviPt1.z = midPt.z + 0.3

    const stepDiviPt1vec = subVecUpdated(stepDiviPt1, circlecenter);
    var divilen1 = Math.sqrt(radius * radius / (stepDiviPt1vec.x * stepDiviPt1vec.x + stepDiviPt1vec.y * stepDiviPt1vec.y + stepDiviPt1vec.z * stepDiviPt1vec.z));
    return drawArrowfromVec(circlecenter, stepDiviPt1vec, divilen1)
}