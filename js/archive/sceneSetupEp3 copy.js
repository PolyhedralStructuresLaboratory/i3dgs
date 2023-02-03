import '/style.css'; //setup basic visual factors for the overall web

import * as THREE from 'three';
import * as Geo from '/js/functions.js';
import { createMultiMaterialObject } from 'three/examples/jsm/utils/SceneUtils';


import {Pane} from 'tweakpane';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

import $ from 'jquery';


//claim variables
var renderer;
var camera;
var scene, scene2;
var light;

var orbit_ctrl;
var trfm_ctrl;
var mouse = new THREE.Vector2();
var rayCaster = new THREE.Raycaster();


var selectObj=null;




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

leftHeader.addEventListener("mousedown", ()=> {
    isMouseDownOnLeft = true;
});

rightHeader.addEventListener("mousedown", ()=> {
    isMouseDownOnRight = true;
});

window.addEventListener("mouseup", ()=> {
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

//initialize global variables
let globalWidth = 2, globalHeight = 2, globalDepth = 2, globalPlaneFactor = 2;

//creating the first pane (left)
const paneLeft = new Pane({
    container: document.getElementById('left_container'),
});

const tab = paneLeft.addTab({
    pages: [
        {title: 'Parameters'},
        {title: 'Advanced'},
    ],
});

// tweakpane - width

const widthParams = {
    MSscale: 1,
};
tab.pages[0].addInput(widthParams, 'MSscale', {
    min: 1,
    max: 4,
    step: 1
}).on('change', (ev) => { //on change, dispose old geometry and create new
  subd.l = ev.value;
  Redraw();
});

// tweakpane - height

const heightParams = {
    height: 2,
};
tab.pages[0].addInput(heightParams, 'height', {
    min: 1,
    max: 5,
}).on('change', (ev) => { //on change, dispose old geometry and create new
    boxMesh.geometry.dispose();
    globalHeight = ev.value;
    boxMesh.geometry = new THREE.BoxGeometry(
        globalWidth,
        globalHeight,
        globalDepth
    );
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(
        globalWidth * globalPlaneFactor,
        globalHeight * globalPlaneFactor,
        10,
        10
    );
});

// tweakpane - depth

const depthParams = {
    depth: 2,
};
tab.pages[0].addInput(depthParams, 'depth', {
    min: 1,
    max: 5,
}).on('change', (ev) => { //on change, dispose old geometry and create new
    boxMesh.geometry.dispose();
    globalDepth = ev.value;
    boxMesh.geometry = new THREE.BoxGeometry(
        globalWidth,
        globalHeight,
        globalDepth
    );
});

//tweakpane - color (new feature!)

const colorParams = {
    skin: '#FF0005'
};
tab.pages[1].addInput(colorParams, 'skin')
    .on('change', (ev) => boxMesh.material.color.set(ev.value));

//tweakpane - new panel (right)

const hiddenPane = new Pane({
    container: document.getElementById('right_container'),
});

const planeVisibilityCheckboxParams = {
    'force cell': false, //at first, box is unchecked so value is "false"
};

//make the checkbox
const planeVisibilityCheckbox = hiddenPane.addInput(planeVisibilityCheckboxParams, 'force cell').on('change', (ev) => { //on change, dispose old plane geometry and create new
     force_group_c.traverse(function(obj) {
      if (obj.type === "Mesh") {
        obj.material.visible =ev.value;
      }
      });
});

const planeFolder = hiddenPane.addFolder({
    title: 'cell scale',
});

planeFolder.hidden = true; //hide the plane folder b/c box is unchecked at first

const planeSizeSliderParams = {
    size: 0.7, //starts as double the size of the box's params
};
var forceCellScale = 0.7
//make the plane size slider
planeFolder.addInput(planeSizeSliderParams, 'size', {
    min: 0.5, //min = double the size of the box's params
    max: 1, //max = quadruple the size of the box's params
}).on('change', (ev) => { //on change, dispose old plane geometry and create new
    forceCellScale = ev.value;
    Redraw();
    force_group_c.traverse(function(obj) {
      if (obj.type === "Mesh") {
        obj.material.visible =ev.value;
      }
      });
});

planeVisibilityCheckbox.on('change', (ev) => { //on change, change the hidden and visibility values set
    planeFolder.hidden = !planeFolder.hidden;
});


//create new OrbitControls object
//orbit_ctrl = new OrbitControls(camera, renderer.domElement);

//add a box
//parameters: width, height, depth
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);

//won't see anything unless you create a mesh, so create a mesh + object

//MeshPhongMaterial adds lighting to plane in comparison to MeshBasicMaterial
const boxMaterial = new THREE.MeshPhongMaterial(
    {
        //colors: https://libxlsxwriter.github.io/working_with_colors.html
        color: 0x800000,

        //make back visible
        side: THREE.DoubleSide,

        //make vertices making the plane visible
        //flatShading: THREE.FlatShading,
        //castShadow: true
    });

//adds the mesh to the scene
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
const boxMesh2 = new THREE.Mesh(boxGeometry, boxMaterial);

//scene.add(boxMesh);
//scene2.add(boxMesh2);

//add a plane
//parameters: width, height, widthSegments, heightSegments
const planeGeometry = new THREE.PlaneGeometry(4, 4, 10, 10);

//won't see anything unless you create a mesh, so create a mesh + object

//MeshPhongMaterial adds lighting to plane in comparison to MeshBasicMaterial
const planeMaterial2 = new THREE.MeshPhongMaterial(
    {
        //colors: https://libxlsxwriter.github.io/working_with_colors.html
        color:'#0b008a',

        //make back visible
        side: THREE.DoubleSide,

        //make vertices making the plane visible
        //flatShading: THREE.FlatShading,

        opacity: 0.5,
        transparent: true, //make translucent

        //castShadow: true
    });

//adds the mesh to the scene
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial2);

//scene.add(planeMesh);
planeMesh.visible = false;















var minkscale= new function () {
  this.l = 0.1
}


// *********************** form diagram inital data ***********************



var formBtPt1 = new THREE.Vector3(1.3,-1.3,-1.3);
var formBtPt2 = new THREE.Vector3(-1.776,-0.476,-1.3);
var formBtPt3 = new THREE.Vector3(0.476,1.776,-1.3);

var Ctrl_pts=[];

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


// *********************** force diagram inital data ***********************

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

var subd = new function () {
  this.l = 1;
}



// *********************** redraw the form and force diagram when parametrer is changing ****************
function Redraw(){
  
  //form groups
  scene.remove(form_group_v);
  scene.remove(form_group_f);
  scene.remove(form_group_e);
  scene.remove(form_group_c);
  scene.remove(form_general);
  scene.remove(form_group_e_trial);
  scene.remove(form_general_trial);
  scene.remove(form_group_mink);


  form_group_v = new THREE.Group();
  form_group_f = new THREE.Group();
  form_group_e = new THREE.Group();
  form_group_c = new THREE.Group();
  form_general = new THREE.Group();
  form_general_trial = new THREE.Group();
  form_group_mink = new THREE.Group();

  form_group_e_trial = new THREE.Group();

  //force groups
  scene2.remove(force_group_v);
  scene2.remove(force_group_f);
  scene2.remove(force_group_e);
  scene2.remove(force_group_c);
  scene2.remove(force_general);
  scene2.remove(force_group_f_trial);
  scene2.remove(force_group_e_trial);
  scene2.remove(force_general_trial);
  scene2.remove(force_group_mink);
  
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
  force_group_mink = new THREE.Group();


  // *********************** form vertices **************************

  //1nd. bottom point (movable) - bottom vertice 1
  const vertice_1 = addVertice(0.04, "sp1", formBtPt1)
  Ctrl_pts.push(vertice_1); //adding to gumbal selection
  const vertice_1_out = addVerticeOut(0.04, vertice_1.position, 1.55);

  form_group_v.add(vertice_1);
  form_group_v.add(vertice_1_out);

  //2nd. bottom point (movable) - bottom vertice 2
  const vertice_2 = addVertice(0.04, "sp2", formBtPt2)
  Ctrl_pts.push(vertice_2); //adding to gumbal selection
  const vertice_2_out = addVerticeOut(0.04, vertice_2.position, 1.55);

  form_group_v.add(vertice_2);
  form_group_v.add(vertice_2_out);

  //3rd. bottom point (movable) - bottom vertice 3
  const vertice_3 = addVertice(0.04, "sp3", formBtPt3)
  Ctrl_pts.push(vertice_3); //adding to gumbal selection
  const vertice_3_out = addVerticeOut(0.04, vertice_3.position, 1.55);
  form_group_v.add(vertice_3);
  form_group_v.add(vertice_3_out);

  // *********************** subdivision levels **************************
  // level 1 - only one apply loads
  
  if(subd.l == 1){
    // apply loads locations o1
    var formPtO1 = new THREE.Vector3((formBtPt1.x+formBtPt2.x+formBtPt3.x)/3,(formBtPt1.y+formBtPt2.y+formBtPt3.y)/3,(formBtPt1.z+formBtPt2.z+formBtPt3.z)/3 + 2);
    var formPtO1b = new THREE.Vector3((formBtPt1.x+formBtPt2.x+formBtPt3.x)/3,(formBtPt1.y+formBtPt2.y+formBtPt3.y)/3,(formBtPt1.z+formBtPt2.z+formBtPt3.z)/3 - 0.5);

    // add apply loads arrows
    var arrow_apply =new THREE.MeshPhongMaterial( {color: 0x009600} );
    var arrow_apply_outline = new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );

    var apply_arrow1 = createCylinderArrowMesh(formPtO1,new THREE.Vector3(formPtO1.x,formPtO1.y,formPtO1.z-0.4),arrow_apply,0.02,0.05,0.56);
    form_general.add(apply_arrow1);
    var apply_arrow12 = createCylinderArrowMesh(new THREE.Vector3(formPtO1.x,formPtO1.y,formPtO1.z+0.005),new THREE.Vector3(formPtO1.x,formPtO1.y,formPtO1.z-0.425),arrow_apply_outline,0.025,0.06,0.53);
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
    var apply_1_geo = new THREE.BufferGeometry().setFromPoints( apply_o1o1B );
    var applyline_o1B = new THREE.LineSegments(apply_1_geo,applyline_dash_form);
    applyline_o1B.computeLineDistances();//compute
    form_general.add(applyline_o1B);

    // ***********************            form faces                **************************
    // green faces : o1 o1b point1 
    var greenface_p1 = FormFace4ptGN(
      new THREE.Vector3(formBtPt1.x,formBtPt1.y, formPtO1b.z),
      new THREE.Vector3(formBtPt1.x,formBtPt1.y, formPtO1.z),
      formPtO1,
      formPtO1b
      )
    form_group_f.add(greenface_p1);

    var green_p1 = [];
    green_p1.push(new THREE.Vector3(formBtPt1.x,formBtPt1.y, formPtO1b.z));
    green_p1.push(new THREE.Vector3(formBtPt1.x,formBtPt1.y, formPtO1.z));
    var green_p1_geo = new THREE.BufferGeometry().setFromPoints(green_p1);
    var dashline_p1 = new THREE.LineSegments(green_p1_geo,applyline_dash_form);
    dashline_p1.computeLineDistances();//compute
    form_group_f.add(dashline_p1);

     // green faces : o1 o1b point2 
    var greenface_p2 = FormFace4ptGN(
      new THREE.Vector3(formBtPt2.x,formBtPt2.y, formPtO1b.z),
      new THREE.Vector3(formBtPt2.x,formBtPt2.y, formPtO1.z),
      formPtO1,
      formPtO1b
      )
    form_group_f.add(greenface_p2);

    var green_p2 = [];
    green_p2.push(new THREE.Vector3(formBtPt2.x,formBtPt2.y, formPtO1b.z));
    green_p2.push(new THREE.Vector3(formBtPt2.x,formBtPt2.y, formPtO1.z));
    var green_p2_geo = new THREE.BufferGeometry().setFromPoints(green_p2);
    var dashline_p2 = new THREE.LineSegments(green_p2_geo,applyline_dash_form);
    dashline_p2.computeLineDistances();//compute
    form_group_f.add(dashline_p2);

    // green faces : o1 o1b point3 
    var greenface_p3 = FormFace4ptGN(
      new THREE.Vector3(formBtPt3.x,formBtPt3.y, formPtO1b.z),
      new THREE.Vector3(formBtPt3.x,formBtPt3.y, formPtO1.z),
      formPtO1,
      formPtO1b
    )
    form_group_f.add(greenface_p3);

    var green_p3 = [];
    green_p3.push(new THREE.Vector3(formBtPt3.x,formBtPt3.y, formPtO1b.z));
    green_p3.push(new THREE.Vector3(formBtPt3.x,formBtPt3.y, formPtO1.z));
    var green_p3_geo = new THREE.BufferGeometry().setFromPoints(green_p3);
    var dashline_p3 = new THREE.LineSegments(green_p3_geo,applyline_dash_form);
    dashline_p3.computeLineDistances();//compute
    form_group_f.add(dashline_p3);

    //form closing plane                  
    //plane mesh
    var form_closingplane = FormPlane3Pt(formBtPt2,formBtPt1,formBtPt3)
    form_general.add(form_closingplane);

    var formline_dash = new THREE.LineDashedMaterial({
      color: "black",//color
      dashSize: 0.1,
      gapSize: 0.03,
      linewidth: 1

    });
  
    var form_linep1p2 = createdashline (formBtPt1, formBtPt2,formline_dash)
    var form_linep2p3 = createdashline (formBtPt2, formBtPt3,formline_dash)
    var form_linep1p3 = createdashline (formBtPt1, formBtPt3,formline_dash)

    form_general.add(form_linep1p2);
    form_general.add(form_linep2p3);
    form_general.add(form_linep1p3);

    //plane face nromals
    var normal_material = new THREE.MeshPhongMaterial({color:"red"})
    var normal_outlinematerial = new THREE.MeshPhongMaterial({color:"white", side:THREE.BackSide})
    var force_normal_material = new THREE.MeshPhongMaterial({color:"red"})
    //normal 124
    var mid_p1p2p3 = new THREE.Vector3((formBtPt1.x+formBtPt2.x+formBtPt3.x)/3,(formBtPt1.y+formBtPt2.y+formBtPt3.y)/3,(formBtPt1.z+formBtPt2.z+formBtPt3.z)/3 )
    var vec_p1p2p3_temp = CalNormalVectorUpdated(formBtPt3,formBtPt2,formBtPt1,1.2)
    var normal_p1p2p3 = new THREE.Vector3(mid_p1p2p3.x-0.2*vec_p1p2p3_temp.x, mid_p1p2p3.y-0.2*vec_p1p2p3_temp.y, mid_p1p2p3.z-0.2*vec_p1p2p3_temp.z)

    var form_normal_1 = createCylinderArrowMesh(mid_p1p2p3,normal_p1p2p3,normal_material,0.015,0.035,0.55);
    var form_normal_1_outline = createCylinderArrowMesh(mid_p1p2p3,normal_p1p2p3,normal_outlinematerial,0.018,0.038,0.54);

    form_general.add(form_normal_1);
    form_general.add(form_normal_1_outline);

    // ***********************            foce diagram            **************************
    var edgescale = 2; // size of the force diagram

    //PtA
    var forcePtA = new THREE.Vector3(0.5,-0.5,0);

    //PtB
    var forcePtBtemp = CalNormalVectorUpdated(formBtPt1, formPtO1, formPtO1b, edgescale );
    var forcePtB = new THREE.Vector3(forcePtA.x - forcePtBtemp.x, forcePtA.y - forcePtBtemp.y, forcePtA.z - forcePtBtemp.z);

    //PtC

    var forcePtC1temp = CalNormalVectorUpdated(formBtPt2, formPtO1, formPtO1b, edgescale);
    var forcePtC1 = new THREE.Vector3(forcePtB.x - forcePtC1temp.x, forcePtB.y - forcePtC1temp.y, forcePtB.z - forcePtC1temp.z);

    var forcePtC2temp = CalNormalVectorUpdated(formBtPt3, formPtO1, formPtO1b, edgescale );
    var forcePtC2 = new THREE.Vector3(forcePtA.x - forcePtC2temp.x, forcePtA.y - forcePtC2temp.y, forcePtA.z - forcePtC2temp.z);

    var dirBC = new THREE.Vector3(); // create once an reuse it

    dirBC.subVectors(forcePtB, forcePtC1).normalize();

    var dirAC = new THREE.Vector3(); // create once an reuse it

    dirAC.subVectors(forcePtC2, forcePtA).normalize();
    var forcePtC = LinesSectPt(dirBC, forcePtB, dirAC, forcePtA);

    //force edges
    var edgeSize = 0.005;
    var edgeColor = "lightgrey";

    var forceEdgeMaterial=new THREE.MeshPhongMaterial( {
      color:  edgeColor
    } );

    const forceEdgeAB = createCylinderMesh(forcePtA,forcePtB,forceEdgeMaterial,edgeSize,edgeSize);
    force_group_e.add(forceEdgeAB);
    
    const forceEdgeAC = createCylinderMesh(forcePtA,forcePtC,forceEdgeMaterial,edgeSize,edgeSize);
    force_group_e.add(forceEdgeAC);

    const forceEdgeBC = createCylinderMesh(forcePtB,forcePtC,forceEdgeMaterial,edgeSize,edgeSize);
    force_group_e.add(forceEdgeBC)

    // *********************** force trial point O **************************

    var TrialP_O = new THREE.Vector3(fo.x,fo.y,fo.z);

    const TrialP_0Sp = addVertice(0.01, "sp1", TrialP_O);
    const TrialP_0Sp_out = addVerticeOut(0.01, TrialP_0Sp.position, 1.55)
    force_group_v.add(TrialP_0Sp);
    force_group_v.add(TrialP_0Sp_out);

    const TrialFaces = ForceTrialFace3Pt(forcePtA,forcePtB,forcePtC, TrialP_O)
    force_group_f_trial.add(TrialFaces)

     // ***********************           trial form                **************************
    var DragPointMat = new THREE.MeshPhongMaterial({color: 0x696969, transparent: true, opacity:0.8});

    var trial_P1 = new THREE.Vector3(formBtPt1.x,formBtPt1.y,triP1.z)

    var trial_o1 = create_trial_intec (trial_P1,forcePtA,TrialP_O,forcePtB,formPtO1,formPtO1b);
    var trial_P2 = create_trial_intec (trial_o1,forcePtB,TrialP_O,forcePtC,formBtPt2,new THREE.Vector3(formBtPt2.x,formBtPt2.y,formBtPt2.z - 1));
    var trial_P3 = create_trial_intec (trial_o1,forcePtA,TrialP_O,forcePtC,formBtPt3,new THREE.Vector3(formBtPt3.x,formBtPt3.y,formBtPt3.z - 1));

    var trial_mesh_p1o1 = createCylinderMesh(trial_o1,trial_P1,DragPointMat,0.02,0.02);
    var trial_mesh_p2o1 = createCylinderMesh(trial_o1,trial_P2,DragPointMat,0.02,0.02);
    var trial_mesh_p3o1 = createCylinderMesh(trial_P3,trial_o1,DragPointMat,0.02,0.02);

    form_group_e_trial.add(trial_mesh_p1o1);
    form_group_e_trial.add(trial_mesh_p2o1);
    form_group_e_trial.add(trial_mesh_p3o1);

    //trial form closing plane                  
    //plane mesh
    var trial_closingplane = FormPlane3Pt(trial_P2,trial_P1,trial_P3)
    form_general_trial.add(trial_closingplane);
    
    var trialline_dash = new THREE.LineDashedMaterial({
      color: "black",//color
      dashSize: 0.1,
      gapSize: 0.03,
      linewidth: 1

    });
  
    var trial_linep1p2 = createdashline ( trial_P1,  trial_P2,trialline_dash)
    var trial_linep2p3 = createdashline ( trial_P2,  trial_P3,trialline_dash)
    var trial_linep1p3 = createdashline ( trial_P1,  trial_P3,trialline_dash)
    

    form_general_trial.add(trial_linep1p2);
    form_general_trial.add(trial_linep2p3);
    form_general_trial.add(trial_linep1p3);

    //trial plane face nromals
    var trialmid_p1p2p3 = new THREE.Vector3((trial_P1.x+trial_P2.x+trial_P3.x)/3,(trial_P1.y+trial_P2.y+trial_P3.y)/3,(trial_P1.z+trial_P2.z+trial_P3.z)/3 )
    var vec_p1p2p3_temp = CalNormalVectorUpdated(trial_P3,trial_P2,trial_P1,1.2)
    var trialnormal_p1p2p3 = new THREE.Vector3(trialmid_p1p2p3.x-0.2*vec_p1p2p3_temp.x, trialmid_p1p2p3.y-0.2*vec_p1p2p3_temp.y, trialmid_p1p2p3.z-0.2*vec_p1p2p3_temp.z)

    var trial_normal_material = new THREE.MeshPhongMaterial({color:"red"})
    var trial_normal_outlinematerial = new THREE.MeshPhongMaterial({color:"white", side:THREE.BackSide})
    var force_normal_material = new THREE.MeshPhongMaterial({color:"red"})

    var trial_normal_1 = createCylinderArrowMesh(trialmid_p1p2p3,trialnormal_p1p2p3,trial_normal_material,0.015,0.035,0.55);
    var trial_normal_1_outline = createCylinderArrowMesh(trialmid_p1p2p3,trialnormal_p1p2p3,trial_normal_outlinematerial,0.018,0.038,0.54);

    form_general_trial.add(trial_normal_1);
    form_general_trial.add(trial_normal_1_outline);

    // ***********************          find trial force point x1              **************************

    //location of x1 
    //find x1
    var ForceX1_vec = CalNormalVectorUpdated(trial_P1,trial_P2,trial_P3,0.5);
    var ForceX1_temp = new THREE.Vector3(TrialP_O.x-1.2*ForceX1_vec.x, TrialP_O.y-1.2*ForceX1_vec.y,TrialP_O.z-1.2*ForceX1_vec.z);   

    //define intersection point x1
    var intersect_x1_vec = new THREE.Vector3(ForceX1_temp.x-TrialP_O.x,ForceX1_temp.y-TrialP_O.y,ForceX1_temp.z-TrialP_O.z);
    var applyplanevec = CalNormalVectorUpdated(forcePtA,forcePtB,forcePtC,0.5);
    var ForceX1 = Cal_Plane_Line_Intersect_Point(TrialP_O,intersect_x1_vec,forcePtB,applyplanevec);

    var line_ox1 = [];
    line_ox1.push(TrialP_O);
    line_ox1.push(ForceX1);
    var line_ox1_geo = new THREE.BufferGeometry().setFromPoints( line_ox1 );
    var applyline_1 = new THREE.LineDashedMaterial({
      color: "black",//color
      dashSize: 0.2,
      gapSize: 0.03,
      linewidth: 1
    });
    var applylineox1 = new THREE.LineSegments(line_ox1_geo,applyline_1);
    applylineox1.computeLineDistances();//compute
    force_general_trial.add(applylineox1);

    var x1_closeP1 = addVectorAlongDir(TrialP_O, ForceX1, -1);
    var x1_closeP2 = addVectorAlongDir(TrialP_O, ForceX1, -0.8);
  
    var x1_arrow = createCylinderArrowMesh(x1_closeP1,x1_closeP2,force_normal_material,0.012,0.025,0.55);
  
    force_general_trial.add(x1_arrow);
    var materialpointx = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
                      
    var spforcePointx = new THREE.SphereGeometry(0.01);
    var new_forcePointx1 = new THREE.Mesh(spforcePointx, materialpointx);
    
    new_forcePointx1.position.copy(ForceX1);
    
    var outlineMaterialx = new THREE.MeshBasicMaterial( { color: "red", transparent: false, side: THREE.BackSide } );
    var outlineMeshnewx1 = new THREE.Mesh( spforcePointx, outlineMaterialx );
    outlineMeshnewx1.position.copy(ForceX1);
    outlineMeshnewx1.scale.multiplyScalar(1.55);

    force_general.add(new_forcePointx1); 
    force_general.add(outlineMeshnewx1); 
    //find constrain point o1
    var ForceO1_temp = CalNormalVectorUpdated(formBtPt1,formBtPt2,formBtPt3,0.5);
    var ForceO1 = new THREE.Vector3(ForceX1.x-o1.l*ForceO1_temp.x, ForceX1.y-o1.l*ForceO1_temp.y,ForceX1.z-o1.l*ForceO1_temp.z);   

    var line_o1x1_temp = [];
    line_o1x1_temp.push(ForceX1);
    line_o1x1_temp.push(ForceO1);

    var line_o1x1_geo = new THREE.BufferGeometry().setFromPoints( line_o1x1_temp );
    var line_o1x1 = new THREE.LineSegments(line_o1x1_geo,applyline_1);
    line_o1x1.computeLineDistances();//compute
    force_general.add(line_o1x1);

    //add o1 arrow
    var ForceO1_closeP1 = addVectorAlongDir(ForceO1, ForceX1, -0.6);
    var ForceO1_closeP2 = addVectorAlongDir(ForceO1, ForceX1, -0.4);
    var ForceO1_arrow = createCylinderArrowMesh(ForceO1_closeP1,ForceO1_closeP2,force_normal_material,0.012,0.025,0.55);

    force_general.add(ForceO1_arrow);
    
    
    // ***********************          find force edges        **************************

    const forceEdgeAO1 = createCylinderMesh(forcePtA,ForceO1,forceEdgeMaterial,edgeSize,edgeSize);
    force_group_e.add(forceEdgeAO1);

    const forceEdgeBO1 = createCylinderMesh(forcePtB,ForceO1,forceEdgeMaterial,edgeSize,edgeSize);
    force_group_e.add(forceEdgeBO1);

    const forceEdgeCO1 = createCylinderMesh(forcePtC,ForceO1,forceEdgeMaterial,edgeSize,edgeSize);
    force_group_e.add(forceEdgeCO1);

      // ***********************          find form edges        **************************

    //New Point o1
    var formPt1 =  CalNormalVectorUpdated(forcePtA,ForceO1,forcePtB,0.5);
    var formPt1end = new THREE.Vector3(formBtPt1.x-1.2*formPt1.x, formBtPt1.y-1.2*formPt1.y,formBtPt1.z-1.2*formPt1.z);  
    var formPt2 =  CalNormalVectorUpdated (forcePtC,ForceO1,forcePtB,0.5);
    var formPt2end = new THREE.Vector3(formBtPt2.x-1.2*formPt2.x, formBtPt2.y-1.2*formPt2.y,formBtPt2.z-1.2*formPt2.z);  

    var diro1 = new THREE.Vector3(); // create once an reuse it
    diro1.subVectors( formBtPt1,formPt1end  ).normalize();
    var diro12 = new THREE.Vector3(); // create once an reuse it
    diro12.subVectors(formBtPt2,formPt2end  ).normalize();
    var formPtO1new = LinesSectPt(diro1,formBtPt1, diro12,formBtPt2);
    var materialpointo = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
    var spformPointO1 = new THREE.SphereGeometry(0.04);
    var new_formPtO1 = new THREE.Mesh(spformPointO1, materialpointo);
    new_formPtO1.position.copy(formPtO1new);
    new_formPtO1.castShadow=true;
    var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: "black", transparent: false, side: THREE.BackSide } );
    var outlineMeshnew1 = new THREE.Mesh( spformPointO1, outlineMaterial1 );
    outlineMeshnew1.position.copy(formPtO1new);
    outlineMeshnew1.scale.multiplyScalar(1.55);

    form_group_v.add(new_formPtO1); 
    form_group_v.add(outlineMeshnew1); 

    //Cal areas
    var areaACO1 = new THREE.Vector3().crossVectors(
      new THREE.Vector3().subVectors( forcePtC, ForceO1 ),
      new THREE.Vector3().subVectors( forcePtA, ForceO1 ),
    ).length()/2

    var areaABO1 = new THREE.Vector3().crossVectors(
      new THREE.Vector3().subVectors( forcePtB, ForceO1 ),
      new THREE.Vector3().subVectors( forcePtA, ForceO1 ),
    ).length()/2

    var areaBCO1 = new THREE.Vector3().crossVectors(
      new THREE.Vector3().subVectors( forcePtB, ForceO1 ),
      new THREE.Vector3().subVectors( forcePtC, ForceO1 ),
    ).length()/2
    

    var areaMax = Math.max(areaACO1, areaABO1, areaBCO1);

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


    var formedgeColor1, formedgeColor2, formedgeColor4

    // triangle ABO1 - 1 
    var normalABO1_a = subVec(forcePtB, forcePtA)
    var normalABO1_b = subVec(forcePtA, ForceO1)
    var normalABO1 = cross(normalABO1_a, normalABO1_b)
    var edgePt1O1 = subVec(formBtPt1, formPtO1new);
    var resultPt1O1 = normalABO1.dot(edgePt1O1)

    if (resultPt1O1 <0){
      if (areaABO1/areaMax >= 0.75){
        formedgeColor1 = 0x0F3150
      }
      if (0.5 <= areaABO1/areaMax & areaABO1/areaMax < 0.75){
        formedgeColor1 = 0x05416D
      }
      if (0.25 <= areaABO1/areaMax & areaABO1/areaMax  < 0.5){
        formedgeColor1 = 0x376D9B
      }
      if (0 <= areaABO1/areaMax & areaABO1/areaMax < 0.25){
        formedgeColor1 = 0x5B84AE
      }
      var forceFaceABO1 = ForceFace3pt(forcePtA, forcePtB, ForceO1, formedgeColor1);
    } else{
      if (areaABO1/areaMax >= 0.75){
        formedgeColor1 = 0x80002F
      }
      if (0.5 <= areaABO1/areaMax & areaABO1/areaMax < 0.75){
        formedgeColor1 = 0x940041
      }
      if (0.25 <= areaABO1/areaMax & areaABO1/areaMax  < 0.5){
        formedgeColor1 = 0xCC0549
      }
      if (0 <= areaABO1/areaMax & areaABO1/areaMax < 0.25){
        formedgeColor1 = 0xD72F62
      }
      var forceFaceABO1 = ForceFace3pt(forcePtA, forcePtB, ForceO1, formedgeColor1);
    }
    var formEdgePt1O1Material=new THREE.MeshPhongMaterial( { 
      color:  formedgeColor1
    } );
    force_group_f.add(forceFaceABO1)

    var edgeSize1 = areaABO1 * 0.02;
    edgeSize1 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);
  
    //create end sphere for bottom vertice 1
    const endPtVertice1SpV = addVectorAlongDir(formBtPt1, formPtO1new, -0.1);
    const endPtVertice1Sp = addEdgeSphere(edgeSize1, endPtVertice1SpV, formedgeColor1)
    //create edge bottom vertice 1
    const endPtVertice1 = addVectorAlongDir(formPtO1new,formBtPt1,  -0.08);
    const formEdge1 = createCylinderMesh(endPtVertice1SpV,endPtVertice1,formEdgePt1O1Material,edgeSize1,edgeSize1);

    form_group_e.add(endPtVertice1Sp)
    form_group_e.add(formEdge1)

    // triangle BCO1 -2 
    var normalBCO1_a = subVec(forcePtC, forcePtB)
    var normalBCO1_b = subVec(forcePtB, ForceO1)
    var normalBCO1 = cross(normalBCO1_a, normalBCO1_b)
    var edgePt2O1 = subVec(formBtPt2, formPtO1new);
    var resultPt2O1 = normalBCO1.dot(edgePt2O1)

    if (resultPt2O1 <0){
      if (areaBCO1/areaMax >= 0.75){
        formedgeColor2 = 0x0F3150
      }
      if (0.5 <= areaBCO1/areaMax & areaBCO1/areaMax < 0.75){
        formedgeColor2 = 0x05416D
      }
      if (0.25 <= areaBCO1/areaMax & areaBCO1/areaMax  < 0.5){
        formedgeColor2 = 0x376D9B
      }
      if (0 <= areaBCO1/areaMax & areaBCO1/areaMax < 0.25){
        formedgeColor2 = 0x5B84AE
      }
      var forceFaceBCO1 = ForceFace3pt(forcePtB, forcePtC, ForceO1, formedgeColor2);
    } else{
      if (areaBCO1/areaMax >= 0.75){
        formedgeColor2 = 0x80002F
      }
      if (0.5 <= areaBCO1/areaMax & areaBCO1/areaMax < 0.75){
        formedgeColor2 = 0x940041
      }
      if (0.25 <= areaBCO1/areaMax & areaBCO1/areaMax  < 0.5){
        formedgeColor2 = 0xCC0549
      }
      if (0 <= areaBCO1/areaMax & areaBCO1/areaMax < 0.25){
        formedgeColor2 = 0xD72F62
      }
      var forceFaceBCO1 = ForceFace3pt(forcePtB, forcePtC, ForceO1, formedgeColor2);
    }
    var formEdgePt2O1Material=new THREE.MeshPhongMaterial( { 
      color:  formedgeColor2
    } );
    force_group_f.add(forceFaceBCO1)

    var edgeSize2 = areaBCO1 * 0.02;
    edgeSize2 = THREE.MathUtils.clamp(edgeSize2, 0.01, 0.5);

    //create end sphere for bottom vertice 1
    const endPtVertice2SpV = addVectorAlongDir(formBtPt2, formPtO1new, -0.1);
    const endPtVertice2Sp = addEdgeSphere(edgeSize2, endPtVertice2SpV, formedgeColor2)
    //create edge bottom vertice 1
    const endPtVertice2 = addVectorAlongDir(formPtO1new,formBtPt2,  -0.08);
    const formEdge2 = createCylinderMesh(endPtVertice2SpV,endPtVertice2,formEdgePt2O1Material,edgeSize2,edgeSize2);

    form_group_e.add(endPtVertice2Sp)
    form_group_e.add(formEdge2)

    // triangle ACO1 - 3
    var normalACO1_a = subVec(forcePtA, forcePtC);
    var normalACO1_b = subVec(forcePtC, ForceO1);
    var normalACO1 = cross(normalACO1_a, normalACO1_b);
    var edgePtO1O3 = subVec(formBtPt3, formPtO1new);
    var resultPtO1O3 = normalACO1.dot(edgePtO1O3);

    if (resultPtO1O3 < 0){
      if (areaACO1/areaMax >= 0.75){
        formedgeColor4 = 0x0F3150
      }
      if (0.5 <= areaACO1/areaMax & areaACO1/areaMax < 0.75){
        formedgeColor4 = 0x05416D
      }
      if (0.25 <= areaACO1/areaMax & areaACO1/areaMax  < 0.5){
        formedgeColor4 = 0x376D9B
      }
      if (0 <= areaACO1/areaMax & areaACO1/areaMax < 0.25){
        formedgeColor4 = 0x5B84AE
      }
      var forceFaceACO1 = ForceFace3pt(forcePtC, forcePtA, ForceO1, formedgeColor4);
    } else{
      if (areaACO1/areaMax >= 0.75){
        formedgeColor4 = 0x80002F
      }
      if (0.5 <= areaACO1/areaMax & areaACO1/areaMax < 0.75){
        formedgeColor4 = 0x940041
      }
      if (0.25 <= areaACO1/areaMax & areaACO1/areaMax  < 0.5){
        formedgeColor4 = 0xCC0549
      }
      if (0 <= areaACO1/areaMax & areaACO1/areaMax < 0.25){
        formedgeColor4 = 0xD72F62
      }
      var forceFaceACO1 = ForceFace3pt(forcePtC, forcePtA, ForceO1, formedgeColor4); 
    }
    
    var formEdgePtO1O3Material=new THREE.MeshPhongMaterial( { 
      color:  formedgeColor4
    } );
    force_group_f.add(forceFaceACO1)

    var edgeSize4 = areaACO1 * 0.02;
    edgeSize4 = THREE.MathUtils.clamp(edgeSize4, 0.01, 0.5);
    
    //create end sphere for bottom vertice 1
    const endPtVertice4SpV = addVectorAlongDir(formBtPt3, formPtO1new, -0.1);
    const endPtVertice4Sp = addEdgeSphere(edgeSize4, endPtVertice4SpV, formedgeColor4)
    //create edge bottom vertice 1
    const endPtVertice4 = addVectorAlongDir(formPtO1new,formBtPt3,  -0.08);
    const formEdge4 = createCylinderMesh(endPtVertice4SpV,endPtVertice4,formEdgePtO1O3Material,edgeSize4,edgeSize4);

    form_group_e.add(endPtVertice4Sp)
    form_group_e.add(formEdge4)

  } 
  

  if(subd.l == 2){
    // // apply loads locations o1
    // var formPtO1 = new THREE.Vector3((formBtPt1.x+formBtPt2.x+formBtPt3.x)/3,(formBtPt1.y+formBtPt2.y+formBtPt3.y)/3,(formBtPt1.z+formBtPt2.z+formBtPt3.z)/3 + 1);

    // // add apply loads arrows
    // var arrow_apply =new THREE.MeshPhongMaterial( {color: 0x009600} );
    // var arrow_apply_outline = new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );

    // var apply_arrow1 = createCylinderArrowMesh(formPtO1,new THREE.Vector3(formPtO1.x,formPtO1.y,formPtO1.z-0.4),arrow_apply,0.02,0.05,0.56);
    // form_general.add(apply_arrow1);
    // var apply_arrow12 = createCylinderArrowMesh(new THREE.Vector3(formPtO1.x,formPtO1.y,formPtO1.z+0.005),new THREE.Vector3(formPtO1.x,formPtO1.y,formPtO1.z-0.425),arrow_apply_outline,0.025,0.06,0.53);
    // form_general.add(apply_arrow12);
  };

  scene.add(form_group_v);
  scene.add(form_group_f);
  scene.add(form_group_e);
  scene.add(form_group_c);
  scene.add(form_general);
  scene.add(form_group_e_trial);
  scene.add(form_general_trial);
  scene.add(form_group_mink);

  scene2.add(force_group_v);
  scene2.add(force_group_f);
  scene2.add(force_group_e);
  scene2.add(force_group_c);
  scene2.add(force_general);

  scene2.add(force_group_e_trial);
  scene2.add(force_group_f_trial);
  scene2.add(force_general_trial);
  scene2.add(force_group_mink);


}















function initModel() {
  Redraw();
  trfm_ctrl = new TransformControls(camera, renderer.domElement);

  trfm_ctrl.addEventListener('change', render);
  trfm_ctrl.addEventListener('objectChange', function(e) {
    if(Math.abs(selectObj.position.x) <= 2 && Math.abs(selectObj.position.y)<=2 && Math.abs(selectObj.position.z) <= 2)
    {
      if(selectObj.name.charAt(2)==='1')
      {
        formBtPt1.x=selectObj.position.x;
        formBtPt1.y=selectObj.position.y;
        formBtPt1.z=selectObj.position.z;
      }

      if(selectObj.name.charAt(2)==='2')
      {
        formBtPt2.x=selectObj.position.x;
        formBtPt2.y=selectObj.position.y;
        formBtPt2.z=selectObj.position.z;
      }

      if(selectObj.name.charAt(2)==='3')
      {
        formBtPt3.x=selectObj.position.x;
        formBtPt3.y=selectObj.position.y;
        formBtPt3.z=selectObj.position.z;
      }

      Redraw();
    }
  })

  trfm_ctrl.addEventListener('mouseDown', (evt) => {
    orbit_ctrl.enabled = false;
    
    });

  trfm_ctrl.addEventListener('mouseUp', (evt) => {

    orbit_ctrl.enabled = true;
  });

  function onMouseDown(event) 
  {
  
    //event.preventDefault();
    rayCaster.setFromCamera(mouse, camera);
    //var rayCaster = getRay(event);
    var intersects = rayCaster.intersectObjects(Ctrl_pts);
    
    if (event.button === 2) { 
      trfm_ctrl.detach();
    }
    //document.addEventListener('mousemove', onMouseMove);

    if (event.button === 0&&intersects[0]) 
      {
        selectObj = intersects[0].object;
        trfm_ctrl.attach(selectObj);
        trfm_ctrl.showX = false;
        trfm_ctrl.showY = false;

        // trfm_ctrl.position.update();
        // console.log(selectObj.position)
        // console.log(trfm_ctrl.position)
      }
  }
  function onMouseUp(event) 
  {
    leftMouseDown = false;
    rightMouseDown = false;
    //document.removeEventListener('mousemove', onMouseMove);
  }
    
  function onMouseMove(event) 
  {
    event.preventDefault();
    
    mouse.x = ((event.clientX*2)/window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY/window.innerHeight) * 2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( Ctrl_pts);

    if(intersects.length > 0) {
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
  var ambient = new THREE.AmbientLight(0xffffff );
  scene.add( ambient );
  scene2.add( ambient.clone() );

  light = new THREE.DirectionalLight( 0xffffff );
  // light.position.set( 1, 1, 1 ).normalize();
  light.position.set( 0, 0, 10 );
  light.shadow.camera.left = -2; // or whatever value works for the scale of scene
  light.shadow.camera.right = 2;
  light.shadow.camera.top = 2;
  light.shadow.camera.bottom = -2;
  light.shadow.camera.near = 0.01;
  light.shadow.camera.far = 200;
  light.castShadow = true;
  light.shadowMapHeight=4096;
  light.shadowMapWidth=4096;
  //light.shadow.map.width=512;
  //light.shadow.map.height=1000;

  scene.add( light );
  scene2.add( light.clone() );

  // ground plane for shadow effects
  var FLOOR = - 2.5;
  var geometry = new THREE.PlaneGeometry( 100, 100 );
  // var planeMaterial = new THREE.MeshLambertMaterial( { color: 0xdddddd } );
  const planeMaterial = new THREE.ShadowMaterial();
  planeMaterial.opacity = 0.2;
  var ground = new THREE.Mesh( geometry, planeMaterial);
  ground.position.set( 0, 0, FLOOR);
  ground.rotation.x = 0;
  ground.scale.set( 100, 100, 100 );
  ground.castShadow = false;
  ground.receiveShadow = true;
  scene.add( ground );
  scene2.add( ground.clone() );

}




// *********************** Basic settings ***********************

// ******** construct render setting
function initRender(){
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
function initCamera(){

  camera = new THREE.PerspectiveCamera(45, window.innerWidth/(window.innerHeight*2), 0.1, 200);
  camera.position.set(8, 0, 0);

  camera.up.x = 0;
  camera.up.y = 0;
  camera.up.z = 1;

  camera.lookAt({
    x : 0,
    y : 0,
    z : 0
  });

  //resize window to maintaian the size of geometry
  window.addEventListener( 'resize', onWindowResize, false );
  function onWindowResize(){
      camera.aspect = window.innerWidth/2 / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
  }
}

// ********* scene setting
function initScene(){
  scene = new THREE.Scene();
  scene2 = new THREE.Scene();
}


var INTERSECTED;
//rendering the scenes
function render() 
{

  //var rayCaster=new THREE.Raycaster();
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
    
        if (event.button === 0&&intersects[0]) 
          {
          
            selectObj = intersects[0].object;
            //console.log("selectobj.name="+intersects[0].object.name.charAt(2));
            trfm_ctrl.attach(selectObj);
          }
          
      }
      
      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
      INTERSECTED.material.color.set(0xF0F02D);
    }
  }
  else
  {
  
    if (INTERSECTED)
    {
      INTERSECTED.material.color.set(INTERSECTED.currentHex);
    }
    INTERSECTED = null;
  }

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  renderer.clear();
  renderer.setViewport(0,0,window.innerWidth/2,window.innerHeight)
  renderer.render(scene, camera);

  renderer.autoClear = false;
  renderer.setViewport(window.innerWidth/2,0,window.innerWidth/2,window.innerHeight)
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
orbit_ctrl = new OrbitControls(camera, renderer.domElement);
initModel();
animate();

// *************** support functions *******************


function create_force_face(point1,point2,pointO){
  var face = new THREE.Vector3().crossVectors(
     new THREE.Vector3().subVectors( point1, pointO ),
     new THREE.Vector3().subVectors( point2, pointO ),
     ).length()/2

  return face
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
  var nnorm = Math.sqrt(n1.x * n1.x + n1.y * n1.y + n1.z * n1.z);
  return nnorm;
}

function LinesSectPt(L1_dir, P1_pnt, L2_dir, P2_pnt) {

  var L1_dir1 = new THREE.Vector3(0, 0, 0);
  var L2_dir2 = new THREE.Vector3(0, 0, 0);

  L1_dir1 = Pnt_copy(L1_dir);
  L2_dir2 = Pnt_copy(L2_dir);



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


  var newPoint = new THREE.Vector3(n * normal.x, n * normal.y, n * normal.z);
  return newPoint;
}

function CalNormalVectorUpdated(vec1, vec2, vec3, n) {

  const VecCB = new THREE.Vector3();
  const VecAB = new THREE.Vector3();
  const normal = new THREE.Vector3();
  VecCB.subVectors(vec1, vec2);
  VecAB.subVectors(vec2, vec3);
  VecAB.cross(VecCB);
  normal.copy(VecAB).normalize();


  var newPoint = new THREE.Vector3(n * normal.x, n * normal.y, n * normal.z);
  return newPoint;
}



//****************** arrow *****************************
function addVectorAlongDir (pt1, pt2, len){
  var C = new THREE.Vector3();
  C.subVectors( pt2, pt1 ).multiplyScalar( 1 + ( len / C.length() ) ).add( pt1 );
  return C
}
//****************** arrow *****************************
function createCylinderArrowMesh(pointX, pointY, material, radius, radiusCone, edgeLengthRatio) 
{
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
var pointMid = new THREE.Vector3().addVectors(pointX, edgeLengthRatio * direction);
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
  coneGeometry = new THREE.CylinderGeometry(0, radiusCone, (1-edgeLengthRatio) * l, 8, 1);
  edgeGeometry.translate( 0,  -(0.5 - 0.5 * edgeLengthRatio) * l, 0 );
  coneGeometry.translate( 0,  (0.5 - 0.5 * (1 - edgeLengthRatio)) * l, 0 );

} else {
  // fixed length cone
  var fixedConeLength = 1;
  edgeGeometry = new THREE.CylinderGeometry(radius, radius, l - fixedConeLength, 8, 1);
  coneGeometry = new THREE.CylinderGeometry(0, radiusCone, fixedConeLength, 8, 1);
  edgeGeometry.translate( 0, - 0.5 * fixedConeLength, 0 );
  coneGeometry.translate( 0, 0.5 * (l - fixedConeLength), 0 );
  
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
function createCylinderMesh(pointX, pointY, material1, radius, radius2) 
{
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
function addVertice(size, name, location){
  var pt_material = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
  var pt_geo = new THREE.SphereGeometry(size);
  var pt_sphare = new THREE.Mesh(pt_geo, pt_material);
  
  pt_sphare.name= name;
  pt_sphare.position.copy(location);
  pt_sphare.castShadow=true;

  return pt_sphare
}

//construct vertices outlines
function addVerticeOut(size, location, scale){
  var pt_material_outline = new THREE.MeshBasicMaterial( { color: "black", transparent: false, side: THREE.BackSide } );
  var pt_geo = new THREE.SphereGeometry(size);
  var pt_geo_outline = new THREE.Mesh( pt_geo, pt_material_outline );
  pt_geo_outline.position.copy(location);
  pt_geo_outline.scale.multiplyScalar(scale);

  return pt_geo_outline
}

//***************** construct form edge ***********************
function addEdgeSphere(size, location, color){
  var pt_material = new THREE.MeshPhongMaterial({color: color, transparent: false});
  var pt_geo = new THREE.SphereGeometry(size);
  var pt_sphare = new THREE.Mesh(pt_geo, pt_material);
  
  pt_sphare.position.copy(location);
  pt_sphare.castShadow=true;

  return pt_sphare
}


//***************** construct faces ***********************
//form faces - green color
function FormFace3ptGN(pt1, pt2, pt3){ 
  
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
      new THREE.MeshBasicMaterial({ color: "white", wireframe: true, transparent: true, opacity: 1 }),
      new THREE.MeshPhongMaterial({
          color: 0x009600, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false
      })
  ];

  var mesh = new createMultiMaterialObject(geometry, material_greenfaces);
  
  return mesh
}

//form faces - grey color
function FormFace3ptGR(pt1, pt2, pt3){
  
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
      new THREE.MeshBasicMaterial({ color: "white", wireframe: true, transparent: true, opacity: 0.8 }),
      new THREE.MeshPhongMaterial({
          color: 0x808080, transparent: true, opacity: 0.15, side: THREE.DoubleSide, depthWrite: false
      })
  ];

  var mesh = new createMultiMaterialObject(geometry, material_greenfaces);
  
  return mesh
}

//force faces
function ForceFace3pt(pt1, pt2, pt3, color){
  
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
          // transparent: true, 
          // opacity: 0.7, 
          side: THREE.DoubleSide, 
          // depthWrite: false 
      })
  ];

  var mesh = new createMultiMaterialObject(geometry, material_greenfaces);
  
  return mesh
}


function FormPlane(pt1, pt2, pt3, pt4){
  
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

  var mesh = new createMultiMaterialObject(geometry, material_greenfaces);
  
  return mesh
}

function FormPlane3Pt(pt1, pt2, pt3){
  
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

  var mesh = new createMultiMaterialObject(geometry, material_greenfaces);
  
  return mesh
}


//force faces - green color
function ForceFace4ptGN(pt1, pt2, pt3, pt4){
  

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
      new THREE.MeshBasicMaterial({ color: "black", wireframe: true, transparent: true, opacity: 0.8 }),
      new THREE.MeshPhongMaterial({
          color: 0x009600, transparent: true, opacity: 0.15, side: THREE.DoubleSide, depthWrite: false
      })
  ];

  var mesh = new createMultiMaterialObject(geometry, material_greenfaces);
  
  return mesh
}

function FormFace4ptGN(pt1, pt2, pt3, pt4){
  

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

  var mesh = new createMultiMaterialObject(geometry, material_greenfaces);
  
  return mesh
}

//force trial faces - grey color
function ForceTrialFace(pt1, pt2, pt3, pt4, ptO){
  
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
      new THREE.MeshBasicMaterial({ color: "white", wireframe: true, transparent: true, opacity: 0.2 }),
      new THREE.MeshPhongMaterial({
          color: "grey", transparent: true, opacity: 0.15, side: THREE.DoubleSide, depthWrite: false
      })
  ];

  var mesh = new createMultiMaterialObject(geometry, material_greenfaces);
  
  return mesh
}

function ForceTrialFace3Pt(pt1, pt2, pt3, ptO){
  
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
      new THREE.MeshBasicMaterial({ color: "white", wireframe: true, transparent: true, opacity: 0.2 }),
      new THREE.MeshPhongMaterial({
          color: "grey", transparent: true, opacity: 0.15, side: THREE.DoubleSide, depthWrite: false
      })
  ];

  var mesh = new createMultiMaterialObject(geometry, material_greenfaces);
  
  return mesh
}


//***************** construct dash lines ***********************
function dashLinesGR(pt1, pt2, sizein, sizeout, scale){
  
  var dashline = new THREE.Group();

  var dashlineMaterial=new THREE.MeshPhongMaterial( {
      color:  0x009600//green
    } );
  var dashlineMaterial_out = new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );
    
  var od1 = pt1.distanceTo(pt2);

  var dl0 = new THREE.Vector3((pt1.x + (pt2.x-pt1.x)*0.08/od1),(pt1.y + (pt2.y-pt1.y)*0.08/od1),(pt1.z + (pt2.z-pt1.z)*0.08/od1));
  var dl1 = new THREE.Vector3((pt1.x + (pt2.x-pt1.x)*0.25/od1),(pt1.y + (pt2.y-pt1.y)*0.25/od1),(pt1.z + (pt2.z-pt1.z)*0.25/od1));

  var dl2 = new THREE.Vector3((pt1.x + (pt2.x-pt1.x)*0.28/od1),(pt1.y + (pt2.y-pt1.y)*0.28/od1),(pt1.z + (pt2.z-pt1.z)*0.28/od1));
  var dl3 = new THREE.Vector3((pt1.x + (pt2.x-pt1.x)*0.45/od1),(pt1.y + (pt2.y-pt1.y)*0.45/od1),(pt1.z + (pt2.z-pt1.z)*0.45/od1));
  
  var dl4 = new THREE.Vector3((pt1.x + (pt2.x-pt1.x)*0.48/od1),(pt1.y + (pt2.y-pt1.y)*0.48/od1),(pt1.z + (pt2.z-pt1.z)*0.48/od1));
  var dl5 = new THREE.Vector3((pt1.x + (pt2.x-pt1.x)*0.65/od1),(pt1.y + (pt2.y-pt1.y)*0.65/od1),(pt1.z + (pt2.z-pt1.z)*0.65/od1));

  var dl6 = new THREE.Vector3((pt1.x + (pt2.x-pt1.x)*0.68/od1),(pt1.y + (pt2.y-pt1.y)*0.68/od1),(pt1.z + (pt2.z-pt1.z)*0.68/od1));
  var dl7 = new THREE.Vector3((pt1.x + (pt2.x-pt1.x)*0.85/od1),(pt1.y + (pt2.y-pt1.y)*0.85/od1),(pt1.z + (pt2.z-pt1.z)*0.85/od1));

  var dl8 = new THREE.Vector3((pt1.x + (pt2.x-pt1.x)*0.88/od1),(pt1.y + (pt2.y-pt1.y)*0.88/od1),(pt1.z + (pt2.z-pt1.z)*0.88/od1));

  var al1 = createCylinderMesh(dl0,dl1,dashlineMaterial,sizein,sizein);
  var al1Out = createCylinderMesh(dl0,dl1,dashlineMaterial_out,sizeout,sizeout);
  al1Out.scale.multiplyScalar(scale);
  dashline.add(al1);
  dashline.add(al1Out);

  var al2 = createCylinderMesh(dl2,dl3,dashlineMaterial,sizein,sizein);
  var al2Out = createCylinderMesh(dl2,dl3,dashlineMaterial_out,sizeout,sizeout);
  al2Out.scale.multiplyScalar(scale);
  dashline.add(al2);
  dashline.add(al2Out);

  var al3 = createCylinderMesh(dl4,dl5,dashlineMaterial,sizein,sizein);
  var al3Out = createCylinderMesh(dl4,dl5,dashlineMaterial_out,sizeout,sizeout);
  al3Out.scale.multiplyScalar(scale);
  dashline.add(al3);
  dashline.add(al3Out);

  var al4 = createCylinderMesh(dl6,dl7,dashlineMaterial,sizein,sizein);
  var al4Out = createCylinderMesh(dl6,dl7,dashlineMaterial_out,sizeout,sizeout);
  al4Out.scale.multiplyScalar(scale);
  dashline.add(al4);
  dashline.add(al4Out);
  
  var al5 = createCylinderMesh(dl8,pt2,dashlineMaterial,sizein,sizein);
  var al5Out = createCylinderMesh(dl8,pt2,dashlineMaterial_out,sizeout,sizeout);
  al5Out.scale.multiplyScalar(scale);
  dashline.add(al5);
  dashline.add(al5Out);
  return dashline
}

function addCell3Face(point1,point2,point3,point4, scale){

  var centroid = new THREE.Vector3((point1.x+point2.x+point3.x+point4.x)/4,(point1.y+point2.y+point3.y+point4.y)/4,(point1.z+point2.z+point3.z+point4.z)/4);
  

  var scale_point1 = new THREE.Vector3(centroid.x + (point1.x - centroid.x)*scale, centroid.y + (point1.y - centroid.y)*scale, centroid.z + (point1.z - centroid.z)*scale );


  var scale_point2 = new THREE.Vector3(centroid.x + (point2.x - centroid.x)*scale, centroid.y + (point2.y - centroid.y)*scale, centroid.z + (point2.z - centroid.z)*scale );


  var scale_point3 = new THREE.Vector3(centroid.x + (point3.x - centroid.x)*scale, centroid.y + (point3.y - centroid.y)*scale, centroid.z + (point3.z - centroid.z)*scale );

  var scale_point4 = new THREE.Vector3(centroid.x + (point4.x - centroid.x)*scale, centroid.y + (point4.y - centroid.y)*scale, centroid.z + (point4.z - centroid.z)*scale );

   
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
  new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true,opacity:0.7}),
  new THREE.MeshPhongMaterial({
  color: "darkgrey",transparent: true,opacity:0.6,side:THREE.DoubleSide,depthWrite:false
  } )
  ];
  
  var cell = new createMultiMaterialObject(geometry, material);
  cell.castShadow = true;

  return cell

}


function addCell4Face(point1,point2,point3,point4, scale){

  var centroid = new THREE.Vector3((point1.x+point2.x+point3.x+point4.x)/4,(point1.y+point2.y+point3.y+point4.y)/4,(point1.z+point2.z+point3.z+point4.z)/4);
  

  var scale_point1 = new THREE.Vector3(centroid.x + (point1.x - centroid.x)*scale, centroid.y + (point1.y - centroid.y)*scale, centroid.z + (point1.z - centroid.z)*scale );


  var scale_point2 = new THREE.Vector3(centroid.x + (point2.x - centroid.x)*scale, centroid.y + (point2.y - centroid.y)*scale, centroid.z + (point2.z - centroid.z)*scale );


  var scale_point3 = new THREE.Vector3(centroid.x + (point3.x - centroid.x)*scale, centroid.y + (point3.y - centroid.y)*scale, centroid.z + (point3.z - centroid.z)*scale );

  var scale_point4 = new THREE.Vector3(centroid.x + (point4.x - centroid.x)*scale, centroid.y + (point4.y - centroid.y)*scale, centroid.z + (point4.z - centroid.z)*scale );

   
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
  new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true,opacity:0.7}),
  new THREE.MeshPhongMaterial({
  color: "darkgrey",side:THREE.DoubleSide,
  // depthWrite:false,
  // transparent: true,opacity:1,
  } )
  ];
  
  var cell = new createMultiMaterialObject(geometry, material);
  cell.castShadow = true;

  return cell

}

function create_trial_intec (startpoint,forceP1,forceP2,forceP3,intecP1,intecP1B){
                          
  var startpoint 
  
  var trial_startpoint_vec = CalNormalVector(forceP1,forceP2,forceP3,0.5);
  var trial_startpoint_intec_temp = new THREE.Vector3(startpoint.x-1.2*trial_startpoint_vec.x, startpoint.y-1.2*trial_startpoint_vec.y,startpoint.z-1.2*trial_startpoint_vec.z);   
  
  var dirtsP = new THREE.Vector3(); // create once an reuse it
  
  dirtsP.subVectors( startpoint,trial_startpoint_intec_temp ).normalize();
  
  var dirto = new THREE.Vector3(); // create once an reuse it
  
  dirto.subVectors( intecP1,intecP1B).normalize();
  
  var trial_intec = LinesSectPt(dirtsP,startpoint,dirto,intecP1);
  return  trial_intec

}

function createdashline (point1, point2,trialline_dash){

  var dashline = [];
  dashline.push(point1);
  dashline.push(point2);
 

  var dashline_geo = new THREE.BufferGeometry().setFromPoints( dashline );

  var trialline_dash = new THREE.LineDashedMaterial({
               color: "black",//color
               dashSize: 0.1,
              gapSize: 0.03,
              linewidth: 1

               });

  var dashline_edges = new THREE.LineSegments(dashline_geo,trialline_dash);
  dashline_edges.computeLineDistances();//compute
  return dashline_edges
}

function Cal_Plane_Line_Intersect_Point(Point_online,LineVec,Point_onPlane,PlaneVec){
 
  var IntersectPoint = new THREE.Vector3(
      //x
      Point_online.x+LineVec.x*((Point_onPlane.x - Point_online.x)*PlaneVec.x+(Point_onPlane.y - Point_online.y)*PlaneVec.y+(Point_onPlane.z - Point_online.z)*PlaneVec.z) / (PlaneVec.x* LineVec.x+ PlaneVec.y* LineVec.y+ PlaneVec.z* LineVec.z), 
      //y
      Point_online.y+LineVec.y*((Point_onPlane.x - Point_online.x)*PlaneVec.x+(Point_onPlane.y - Point_online.y)*PlaneVec.y+(Point_onPlane.z - Point_online.z)*PlaneVec.z) / (PlaneVec.x* LineVec.x+ PlaneVec.y* LineVec.y+ PlaneVec.z* LineVec.z),
      //z
      Point_online.z+LineVec.z*((Point_onPlane.x - Point_online.x)*PlaneVec.x+(Point_onPlane.y - Point_online.y)*PlaneVec.y+(Point_onPlane.z - Point_online.z)*PlaneVec.z) / (PlaneVec.x* LineVec.x+ PlaneVec.y* LineVec.y+ PlaneVec.z* LineVec.z))

 return IntersectPoint;
}

function ForceFace(pt0, pt1, pt2, pt3, pt4, pt5){
  
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
      new THREE.MeshBasicMaterial({ color: "black", wireframe: true, transparent: false, opacity: 0.01 }),
      new THREE.MeshPhongMaterial({
          color: 0x009600, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false
      })
  ];

  var mesh = new createMultiMaterialObject(geometry, material_greenfaces);
  mesh.children[0].castShadow = true;
  return mesh
}

function create_form_tubes(face,face_max,scale,startPoint,targetPoint,PointO){
  var form_mesh = face/face_max
  var tt = scale*face
 
  var Close_Point = addVectorAlongDir(startPoint, targetPoint, -1);
  var Close_Point2 = addVectorAlongDir(targetPoint, startPoint, -1);

  // var Sphere_Point = new THREE.Sphere(new THREE.Vector3(targetPoint.x,targetPoint.y,targetPoint.z),0.1);
  // var Close_Point = Sphere_Point.clampPoint(startPoint);

  // var Sphere_Point2 = new THREE.Sphere(new THREE.Vector3(startPoint.x,startPoint.y,startPoint.z),0.1);
  // var Close_Point2 = Sphere_Point2.clampPoint(targetPoint);


  if (PointO.z<=forcePtA.z){

          if (form_mesh<0.25 & form_mesh>=0)
            { var Colorbar_blue_1 = new THREE.MeshPhongMaterial( {
                                color: 0x5B84AE
                            } );
           var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
           var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
           var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
           sp_Point.position.copy(Close_Point);
           sp_Point2.position.copy(Close_Point2);
           var tubeMesh=createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_1,tt,tt);
           //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_1,0.02,0.05,0.6);
                          }
          if (form_mesh<0.5 & form_mesh>=0.25)
          {  var Colorbar_blue_2 = new THREE.MeshPhongMaterial( {
                                color: 0x376D9B
                            } );
           var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
           var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
           var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
           sp_Point.position.copy(Close_Point);
           sp_Point2.position.copy(Close_Point2);
           var tubeMesh=createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_2,tt,tt);
          // var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_2,0.02,0.05,0.6);
                          }
          if (form_mesh<0.75 & form_mesh>=0.5)
          {  var Colorbar_blue_3 = new THREE.MeshPhongMaterial( {
                                color: 0x05416D
                            } );
           var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
           var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
           var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
           sp_Point.position.copy(Close_Point);
           sp_Point2.position.copy(Close_Point2);
           var tubeMesh=createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_3,tt,tt);
           //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_3,0.02,0.05,0.6);
          }

          if (form_mesh>=0.75)
          {  var Colorbar_blue_4 = new THREE.MeshPhongMaterial( {
                                color: 0x0F3150
                            } );
           var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
           var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
           var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
           sp_Point.position.copy(Close_Point);
           sp_Point2.position.copy(Close_Point2);
           var tubeMesh=createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_4,tt,tt);
           //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_4,0.02,0.05,0.6);
          }
          form_group.add(sp_Point); 
      form_group.add(sp_Point2);
      form_group.add(tubeMesh); 
      // form_group.add(tube_arrow_3o2); 
      sp_Point.castShadow=true;
      sp_Point2.castShadow=true;
      tubeMesh.castShadow=true;

  }

 else if(PointO.z>forcePtA.z){

      if (form_mesh<0.25 & form_mesh>=0)
      { var Colorbar_red_1 = new THREE.MeshPhongMaterial( {
                           color: 0xD72F62
                       } );
           var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
           var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
           var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
           sp_Point.position.copy(Close_Point);
           sp_Point2.position.copy(Close_Point2);
           var tubeMesht=createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_1,tt,tt);
           //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
                     }
     if (form_mesh<0.5 & form_mesh>=0.25)
     {  var Colorbar_red_2 = new THREE.MeshPhongMaterial( {
                           color: 0xCC0549
                       } );
           var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
           var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
           var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
           sp_Point.position.copy(Close_Point);
           sp_Point2.position.copy(Close_Point2);
           var tubeMesht=createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_2,tt,tt);
            //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
                     }
     if (form_mesh<0.75 & form_mesh>=0.5)
     {  var Colorbar_red_3 = new THREE.MeshPhongMaterial( {
                           color: 0x940041
                       } );
           var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
           var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
           var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
           sp_Point.position.copy(Close_Point);
           sp_Point2.position.copy(Close_Point2);
           var tubeMesht=createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_3,tt,tt);
           //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
     }

     if (form_mesh>=0.75)
     {  var Colorbar_red_4 = new THREE.MeshPhongMaterial( {
                           color: 0x80002F
                       } );
           var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
           var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
           var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
           sp_Point.position.copy(Close_Point);
           sp_Point2.position.copy(Close_Point2);
           var tubeMesht=createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_4,tt,tt);
      //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
     }
     form_group.add(sp_Point); 
      form_group.add(sp_Point2);
      form_group.add(tubeMesht); 
      // form_group.add(tube_arrow_3o2); 
      sp_Point.castShadow=true;
      sp_Point2.castShadow=true;
      tubeMesht.castShadow=true;
                           
                     }



}

function face_center(n1,n2,n3){

  var face_centerD=new THREE.Vector3();

      face_centerD.x=(n1.x+n2.x+n3.x)/3;
      face_centerD.y=(n1.y+n2.y+n3.y)/3;
      face_centerD.z=(n1.z+n2.z+n3.z)/3;

      return face_centerD;

}

function create_Tri_FaceMesh(p1,p2,p3,arr_face_dir,Is_First,arr_dir,text)
      {

          var corepoint=face_center(p1,p2,p3);
          var m = 0.2;//scale

          //move point
          var dirA=new THREE.Vector3().subVectors(corepoint,p1);
          var dirB=new THREE.Vector3().subVectors(corepoint,p2);
          var dirC=new THREE.Vector3().subVectors(corepoint,p3);

          dirA.normalize();
          dirB.normalize();
          dirC.normalize();

          // var unit_dir1=new THREE.Vector3();//normal
          // unit_dir1.x=dirA.x/norm(dirA);
          // unit_dir1.y=dirA.y/norm(dirA);
          // unit_dir1.z=dirA.z/norm(dirA);

          // var unit_dir2=new THREE.Vector3();//normal
          // unit_dir2.x=dirB.x/norm(dirB);
          // unit_dir2.y=dirB.y/norm(dirB);
          // unit_dir2.z=dirB.z/norm(dirB);

          // var unit_dir3=new THREE.Vector3();//normal
          // unit_dir3.x=dirC.x/norm(dirC);
          // unit_dir3.y=dirC.y/norm(dirC);
          // unit_dir3.z=dirC.z/norm(dirC);


          //move point

          var p1_1=new THREE.Vector3();
         // p1_1=subVec(p1,m*unit_dir1);
          p1_1.x=p1.x+m*dirA.x;
          p1_1.y=p1.y+m*dirA.y;
          p1_1.z=p1.z+m*dirA.z;

          var p2_1=new THREE.Vector3();
          p2_1.x=p2.x+m*dirB.x;
          p2_1.y=p2.y+m*dirB.y;
          p2_1.z=p2.z+m*dirB.z;

          var p3_1=new THREE.Vector3();
          p3_1.x=p3.x+m*dirC.x;
          p3_1.y=p3.y+m*dirC.y;
          p3_1.z=p3.z+m*dirC.z;



          var vertices_tri=[
          p1_1,p2_1,p3_1
          ];

          var faces_tri=[
          new THREE.Face3(2,1,0),

          ];


          var geom_tri = new THREE.Geometry();
          geom_tri.vertices = vertices_tri;
          geom_tri.faces = faces_tri;
          geom_tri.computeFaceNormals();


          for (i = 0;i<geom_tri.faces.length;i++){
          if(Is_First)
          {
              var hex =0x008000;
              geom_tri.faces[i].color.setHex(hex);
          }
          else
          {
              var hex =0xa9a9a9;
              geom_tri.faces[i].color.setHex(hex);
              }

          }

          //  var materials = new THREE.MeshBasicMaterial( {
          // vertexColors: THREE.FaceColors
          // } );

          var materials_tri = [
          //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
          // new THREE.MeshBasicMaterial({color: 0x4d4dff, wireframe: true,transparent: true,opacity:0.05}),
          new THREE.MeshBasicMaterial( {
          vertexColors: THREE.FaceColors,transparent: true,opacity:0.2,side:THREE.DoubleSide
          } )
          ];

          var mesh_tri = new THREE.SceneUtils.createMultiMaterialObject(geom_tri, materials_tri);

          // return mesh_tri;

          //arrowHelper1.add(mesh_tri)

          //var arrowHelper1;


          //var length = 1;
          // var hex = 0x000000;//black
          if(Is_First)

          var arr_face_material=new THREE.MeshPhongMaterial( {
              color:  0x009600//force face green
          } );
          else
          var arr_face_material=new THREE.MeshPhongMaterial( {
              color:  0x000000//force face black
          } );

          var arr_material2;

              if(arr_dir<0)//c or t
              {
                  arrow_material2=new THREE.MeshPhongMaterial( {
              color: 0xC00000//red
              });

              }
              else
              {
                  arrow_material2=new THREE.MeshPhongMaterial( {

              color: 0x0F3150//blue
              });

              }


          //in or out

          var forceFaceDir=Pnt_copy(arr_face_dir);
          forceFaceDir.normalize();

              //in or out
              var out1=new THREE.Vector3();
              out1.x=corepoint.x+0.2*forceFaceDir.x;
              out1.y=corepoint.y+0.2*forceFaceDir.y;
              out1.z=corepoint.z+0.2*forceFaceDir.z;


              var out2=new THREE.Vector3();
              out2.x=corepoint.x-0.2*forceFaceDir.x;
              out2.y=corepoint.y-0.2*forceFaceDir.y;
              out2.z=corepoint.z-0.2*forceFaceDir.z;

              var out1_core=new THREE.Vector3().subVectors(out1,corePoint_body2);
              var out2_core=new THREE.Vector3().subVectors(out2,corePoint_body2);

              if(out1_core.length()>out2_core.length())//out
              {


              var arrowHP1=createCylinderArrowMesh(p3_1,p1_1,arr_face_material,0.01,0.03,0.9);//face arr

              // var direction1 = new THREE.Vector3().subVectors(p1_1, p3_1);
              // var length1=direction1.length();
              // direction1.normalize();
              // var arrowHelper1 = new THREE.ArrowHelper(direction1, p3_1, length1,hex,0.2,0.05);
             mesh_tri.add(arrowHP1);

              // var direction2 = new THREE.Vector3().subVectors(p3_1, p2_1);
              // var length2=direction2.length();
              // direction2.normalize();
              // var arrowHelper2 = new THREE.ArrowHelper(direction2, p2_1, length2,hex,0.2,0.05);
               var arrowHP2=createCylinderArrowMesh(p2_1,p3_1,arr_face_material,0.01,0.03,0.9);//face arr
              mesh_tri.add(arrowHP2);

              // var direction3 = new THREE.Vector3().subVectors(p2_1, p1_1);
              // var length3=direction3.length();
              // direction3.normalize();
              // var arrowHelper3 = new THREE.ArrowHelper(direction3, p1_1, length3,hex,0.2,0.05);
               var arrowHP3=createCylinderArrowMesh(p1_1,p2_1,arr_face_material,0.01,0.03,0.9);//face arr
              mesh_tri.add(arrowHP3);

               //draw normal

              var corepoint2=new THREE.Vector3();
              corepoint2.x=corepoint.x+0.4*forceFaceDir.x;
              corepoint2.y=corepoint.y+0.4*forceFaceDir.y;
              corepoint2.z=corepoint.z+0.4*forceFaceDir.z;

              var corepoint3=new THREE.Vector3();
              corepoint3.x=corepoint.x+0.37*forceFaceDir.x;
              corepoint3.y=corepoint.y+0.37*forceFaceDir.y;
              corepoint3.z=corepoint.z+0.37*forceFaceDir.z;



              //=new THREE.ArrowHelper(forceFaceDir,corepoint,0.5*forceFaceDir.length(),0x00ff00,0.2,0.1);
              if(Is_First)//color diff
              {
                  var arrow_material1=new THREE.MeshPhongMaterial( {
              color: 0x009600
          } );
               var arrowN=createCylinderArrowMesh(corepoint,corepoint2,arrow_material1,0.02,0.05,0.6);
               //
              }
              else
               var arrowN=createCylinderArrowMesh(corepoint,corepoint2,arrow_material2,0.02,0.05,0.6);


              mesh_tri.add(arrowN);

              if(Is_First)//color diff
              {
                  var arrow_material_outline= new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );
               var arrowN_O=createCylinderArrowMesh(corepoint,corepoint3,arrow_material_outline,0.025,0.05,0.55);
               //
              }
              else
                  var arrow_material_outline= new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );
                  var arrowN_O=createCylinderArrowMesh(corepoint,corepoint3,arrow_material_outline,0.025,0.05,0.55);



              mesh_tri.add(arrowN_O);
              arrowN_O.scale.multiplyScalar(1.2);

              var TXMesh=createSpriteText(text,corepoint2);

              text_group2.add(TXMesh);

              //face arr

               var cir_dir=new THREE.Vector3().subVectors(corepoint,p1);
              cir_dir.normalize();

              var arrowpt=new THREE.Vector3();
              arrowpt.x=corepoint.x+0.2*cir_dir.x;
              arrowpt.y=corepoint.y+0.2*cir_dir.y;
              arrowpt.z=corepoint.z+0.2*cir_dir.z;

                   //arr_dir.normalize();

              var direction1=cir_dir.applyAxisAngle(forceFaceDir,Math.PI/2);

           //var direction1 = new THREE.Vector3().subVectors(p1, p2);
              var length1=0.001;
              direction1.normalize();
              var arrowHelper1 = new THREE.ArrowHelper(direction1, arrowpt, length1,"black",0.1,0.05);

      //        mesh_tri.add(arrowHelper1);


             //cir arr

             var circle_mesh=createCircleFaceArrow(corepoint,0.1,forceFaceDir);
             mesh_tri.add(circle_mesh);

             //var step_1=createCircleFaceArrow2(TubePoints1[1],0.2,forceFaceDir);
            // Tube_group.add(step_1);


              }
              else
              {

              // var direction1 = new THREE.Vector3().subVectors(p2_1, p1_1);
              // var length1=direction1.length();
              // direction1.normalize();
              // var arrowHelper1 = new THREE.ArrowHelper(direction1, p1_1, length1,hex,0.1,0.05);
              var arrowHP1=createCylinderArrowMesh(p1_1,p2_1,arr_face_material,0.01,0.03,0.9);//face arr
              mesh_tri.add(arrowHP1);

              // var direction2 = new THREE.Vector3().subVectors(p3_1, p2_1);
              // var length2=direction2.length();
              // direction2.normalize();
              // var arrowHelper2 = new THREE.ArrowHelper(direction2, p2_1, length2,hex,0.1,0.05);
              var arrowHP2=createCylinderArrowMesh(p2_1,p3_1,arr_face_material,0.01,0.03,0.9);//face arr
              mesh_tri.add(arrowHP2);



              // var direction3 = new THREE.Vector3().subVectors(p1_1, p3_1);
              // var length3=direction3.length();
              // direction3.normalize();
              // var arrowHelper3 = new THREE.ArrowHelper(direction3, p3_1, length3,hex,0.1,0.05);
              var arrowHP3=createCylinderArrowMesh(p3_1,p1_1,arr_face_material,0.01,0.03,0.9);//face arr
              mesh_tri.add(arrowHP3);



              var corepoint2=new THREE.Vector3();
              corepoint2.x=corepoint.x-0.4*forceFaceDir.x;
              corepoint2.y=corepoint.y-0.4*forceFaceDir.y;
              corepoint2.z=corepoint.z-0.4*forceFaceDir.z;

              var corepoint3=new THREE.Vector3();
              corepoint3.x=corepoint.x-0.37*forceFaceDir.x;
              corepoint3.y=corepoint.y-0.37*forceFaceDir.y;
              corepoint3.z=corepoint.z-0.37*forceFaceDir.z;

              if(Is_First)//color diff
              {
                  var arrow_material1=new THREE.MeshPhongMaterial( {
              color: 0x009600
          } );
               //var arrowN=createCylinderArrowMesh(corepoint,corepoint2,arrow_material1,0.02,0.05,0.7);
               var arrowN=createCylinderArrowMesh(corepoint2,corepoint,arrow_material1,0.02,0.05,0.6);

              }
              else
               var arrowN=createCylinderArrowMesh(corepoint2,corepoint,arrow_material2,0.02,0.05,0.6);


              //=new THREE.ArrowHelper(forceFaceDir,corepoint,0.5*forceFaceDir.length(),0x00ff00,0.2,0.1);



              //draw normal

              //var dirN=cross(direction2,direction1);

              //dirN.normalize();


              //var arrowN=new THREE.ArrowHelper(forceFaceDir,corepoint,0.5*forceFaceDir.length(),0x00ff00,0.2,0.1);
              mesh_tri.add(arrowN);

              if(Is_First)//color diff
              {
                  var arrow_material_outline= new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );
               var arrowN_O=createCylinderArrowMesh(corepoint3,corepoint,arrow_material_outline,0.025,0.05,0.55);
               //
              }
              else
                  var arrow_material_outline= new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );
                  var arrowN_O=createCylinderArrowMesh(corepoint3,corepoint,arrow_material_outline,0.025,0.05,0.55);



              mesh_tri.add(arrowN_O);
              arrowN_O.scale.multiplyScalar(1.2);

              var TXMesh1=createSpriteText(text,corepoint2);

              text_group2.add(TXMesh1);

              // var Line_center=new THREE.Vector3((p1.x+p2.x)/2,(p1.y+p2.y)/2,(p1.z+p2.z)/2);

              var cir_dir=new THREE.Vector3().subVectors(corepoint,p1);
              cir_dir.normalize();

              var arrowpt=new THREE.Vector3();
              arrowpt.x=corepoint.x+0.2*cir_dir.x;
              arrowpt.y=corepoint.y+0.2*cir_dir.y;
              arrowpt.z=corepoint.z+0.2*cir_dir.z;

                   //arr_dir.normalize();

              var direction1=cir_dir.applyAxisAngle(forceFaceDir,Math.PI/2);

           //var direction1 = new THREE.Vector3().subVectors(p1, p2);
              var length1=0.001;
              direction1.normalize();
             var arrowHelper1 = new THREE.ArrowHelper(direction1, arrowpt, length1,"black",0.1,0.1);

  //            mesh_tri.add(arrowHelper1);


             //cir arr

             var circle_mesh=createCircleFaceArrow(corepoint,0.1,forceFaceDir);
             mesh_tri.add(circle_mesh);

       

            // var step_1=createCircleFaceArrow2(TubePoints1[1],0.4,Force_face_dir[0]);
            // Tube_group.add(step_1);


              }







          //draw normal



          return mesh_tri;



          //var polyhedron =createMesh(new THREE.PolyhedronGeometry(vertices,faces));



      }

function createSpriteText(text,pos){
  //canva
  var canvas = document.createElement("canvas");
  canvas.width=240;
  canvas.height=240;
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "grey";
  ctx.font = "100px Palatino";
  ctx.lineWidth = 2;
  ctx.fillText(text.charAt(0),150,150);
  ctx.fillStyle = "grey";
  ctx.font = "50px Palatino";
  ctx.lineWidth = 2;
  ctx.fillText(text.charAt(1),210,170);

  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  //text
  var material = new THREE.SpriteMaterial({map:texture,transparent:true});
  var textObj = new THREE.Sprite(material);
  textObj.scale.set(0.5, 0.5, 0.5);


  //textObj.position.set(pos1);

  var posdir=Pnt_copy(pos);

  posdir.normalize();

  textObj.position.x =pos.x+0.1*posdir.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
  textObj.position.y =pos.y+0.1*posdir.y;
  textObj.position.z =pos.z+0.1*posdir.z;


  return textObj;
}