import '/style.css'; //setup basic visual factors for the overall web

import * as THREE from 'three';
import * as Geo from '/js/functions.js';

import {Pane} from 'tweakpane';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

import $ from 'jquery';

import { createMultiMaterialObject } from 'three/examples/jsm/utils/SceneUtils';


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
    width: 2,
};
tab.pages[0].addInput(widthParams, 'width', {
    min: 1,
    max: 5,
}).on('change', (ev) => { //on change, dispose old geometry and create new
    boxMesh.geometry.dispose();
    globalWidth = ev.value;
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

















// *********************** form diagram inital data ***********************

var formTpPt = [];
formTpPt.push(new THREE.Vector3(0,0,0));
formTpPt.push(new THREE.Vector3(0,0,1));

var formBtPt1 = [];
formBtPt1.push(new THREE.Vector3(0,0,0));
formBtPt1.push(new THREE.Vector3(1,-1,-1));

var formBtPt2= [];
formBtPt2.push(new THREE.Vector3(0,0,0));
formBtPt2.push(new THREE.Vector3(-1.3660,-0.3660,-1));

var formBtPt3 = [];
formBtPt3.push(new THREE.Vector3(0,0,0));
formBtPt3.push(new THREE.Vector3(0.3660,1.3660,-1));

var Ctrl_pts=[];

var form_general

var form_group_v
var form_group_f
var form_group_e
var form_group_c
var form_group_e_trial
var form_general_trial
var form_general_global


var form_group_mink

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
var force_general_global

var force_text


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
  scene.remove(form_general_global);
  scene.remove(form_group_mink);

  form_group_v = new THREE.Group();
  form_group_f = new THREE.Group();
  form_group_e = new THREE.Group();
  form_group_c = new THREE.Group();
  form_general = new THREE.Group();
  form_general_trial = new THREE.Group();
  form_group_mink = new THREE.Group();

  form_group_e_trial = new THREE.Group();
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
  scene2.remove(force_group_mink);
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
  force_group_mink = new THREE.Group();
  force_general_global = new THREE.Group();


  // *********************** form vertices **************************
  // set basic points in form diagram (one top, one mid (0,0,0), three bottoms)
  // 1st. mid point
  const vertice_0 = addVertice(0.05, "sp0", new THREE.Vector3(0,0,0));
  const vertice_0_out = addVerticeOut(0.05, new THREE.Vector3(0,0,0), 1.55)
  form_group_v.add(vertice_0);
  form_group_v.add(vertice_0_out);

  //2nd. bottom point (movable) - bottom vertice 1
  const vertice_1 = addVertice(0.04, "sp1", formBtPt1[1])
  Ctrl_pts.push(vertice_1); //adding to gumbal selection
  const vertice_1_out = addVerticeOut(0.04, vertice_1.position, 1.55);

  form_group_v.add(vertice_1);
  form_group_v.add(vertice_1_out);

  //3rd. bottom point (movable) - bottom vertice 2
  const vertice_2 = addVertice(0.04, "sp2", formBtPt2[1])
  Ctrl_pts.push(vertice_2); //adding to gumbal selection
  const vertice_2_out = addVerticeOut(0.04, vertice_2.position, 1.55);

  form_group_v.add(vertice_2);
  form_group_v.add(vertice_2_out);

  //4th. bottom point (movable) - bottom vertice 3
  const vertice_3 = addVertice(0.04, "sp3", formBtPt3[1])
  Ctrl_pts.push(vertice_3); //adding to gumbal selection
  const vertice_3_out = addVerticeOut(0.04, vertice_3.position, 1.55);
  form_group_v.add(vertice_3);
  form_group_v.add(vertice_3_out);



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


  // *********************** form cells **************************
  const formCell1 = addCell3Face(formTpPt[0], formTpPt[1], formBtPt1[1], formBtPt2[1], 0.8)
  form_group_c.add(formCell1);

  const formCell2 = addCell3Face(formTpPt[0], formTpPt[1], formBtPt2[1], formBtPt3[1], 0.8)
  form_group_c.add(formCell2);

  const formCell3 = addCell3Face(formTpPt[0], formTpPt[1], formBtPt1[1], formBtPt3[1], 0.8)
  form_group_c.add(formCell3);

  const formCell4 = addCell3Face(formTpPt[0], formBtPt1[1], formBtPt2[1], formBtPt3[1],0.8)
  form_group_c.add(formCell4);



  var normal_apply =new THREE.MeshPhongMaterial( {color: 0x009600} );
  var normal_apply_outline = new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );

  var normal_applyGlob =new THREE.MeshPhongMaterial( {color: 0x009600} );
  var normal_apply_outlineGlob = new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );

  var arrow_apply =new THREE.MeshPhongMaterial( {color: 0x009600} );
  var arrow_apply_outline = new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );

  var arrow_applyGlob =new THREE.MeshPhongMaterial( {color: 0x009600} );
  var arrow_apply_outlineGlob = new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );

  var applyline_dash_glob = new THREE.LineDashedMaterial({
    color: 0x009600,//color
    dashSize: 0.05,
    gapSize: 0.03,
    linewidth: 1
  });

  // *********************** form apply loads dash lines **************************
  const dashline = dashLinesGR(formTpPt[0], formTpPt[1], 0.008, 0.01, 1.02);
  form_general.add(dashline);

  // *********************** form apply loads arrow **************************
  var applyArrowMaterial=new THREE.MeshPhongMaterial( {
    color:  0x009600//green
  } );

  var applyArrowMaterialOut=new THREE.MeshPhongMaterial( {
    color:  "white",
    transparent: false, 
    side: THREE.BackSide
  } );
  const applyArrow = createCylinderArrowMesh(new THREE.Vector3(formTpPt[1].x, formTpPt[1].y, formTpPt[1].z + 0.3), formTpPt[1], applyArrowMaterial, 0.015,0.035,0.55);
  form_general.add(applyArrow);

  const applyArrowOut = createCylinderArrowMesh(new THREE.Vector3(formTpPt[1].x, formTpPt[1].y, formTpPt[1].z + 0.3), formTpPt[1], applyArrowMaterialOut, 0.02,0.04,0.545);
  form_general.add(applyArrowOut);



  // *****************
  // force
  // ******************

  // *********************** force diagram ***********************
  // *********************** force points ***********************
  var edgescale = 2; // size of the force diagram

  //PtA and PtB
  var forcePtA = new THREE.Vector3(0.5, 0, 0)

  var forcePtBtemp = CalNormalVectorUpdated(formBtPt1[1], formTpPt[1], formTpPt[0], edgescale );
  var forcePtB = new THREE.Vector3(forcePtA.x - forcePtBtemp.x, forcePtA.y - forcePtBtemp.y, forcePtA.z - forcePtBtemp.z);

  //PtC

  var forcePtC1temp = CalNormalVectorUpdated(formBtPt2[1], formTpPt[1], formTpPt[0], edgescale);
  var forcePtC1 = new THREE.Vector3(forcePtB.x - forcePtC1temp.x, forcePtB.y - forcePtC1temp.y, forcePtB.z - forcePtC1temp.z);

  var forcePtC2temp = CalNormalVectorUpdated(formBtPt3[1], formTpPt[1], formTpPt[0], edgescale );
  var forcePtC2 = new THREE.Vector3(forcePtA.x - forcePtC2temp.x, forcePtA.y - forcePtC2temp.y, forcePtA.z - forcePtC2temp.z);

  var dirBC = new THREE.Vector3(); // create once an reuse it

  dirBC.subVectors(forcePtB, forcePtC1).normalize();

  var dirAC = new THREE.Vector3(); // create once an reuse it

  dirAC.subVectors(forcePtC2, forcePtA).normalize();
  var forcePtC = LinesSectPt(dirBC, forcePtB, dirAC, forcePtA);

  // *********************** caculating the normals for apply loads *********************** 
  // triangle ABC 
  var normalABC_a = subVec(forcePtA, forcePtB)
  var normalABC_b = subVec(forcePtB, forcePtC)
  var normalABC = cross(normalABC_a, normalABC_b)

  var edgeVector0 = subVec(formTpPt[0], formTpPt[1]);
  var resultapply = normalABC.dot(edgeVector0)

  var forcePtBUpdated, forcePtCUpdated
  
  // redefine the force points PtB, PtC ( one condition is that the force diagram flipped)

  if (resultapply<0){
    var forcePtBtemp = CalNormalVectorUpdated(formBtPt1[1], formTpPt[1], formTpPt[0], -edgescale );
    var forcePtBnew = new THREE.Vector3(forcePtA.x - forcePtBtemp.x, forcePtA.y - forcePtBtemp.y, forcePtA.z - forcePtBtemp.z);
    forcePtB= forcePtBnew
    var lenAC = forcePtA.distanceTo(forcePtC);
    forcePtC=  addVectorAlongDir(forcePtA, forcePtC, lenAC)
  }

  // redefine the force point PtD ( one condition is that the force diagram flipped)

  //PtD

  if (resultapply>0){
    var forcePtD1temp = CalNormalVectorUpdated(formBtPt1[1], formTpPt[0], formBtPt3[1], edgescale );
    var forcePtD1 = new THREE.Vector3(forcePtA.x - forcePtD1temp.x, forcePtA.y - forcePtD1temp.y, forcePtA.z - forcePtD1temp.z);

    var forcePtD2temp = CalNormalVectorUpdated(formBtPt2[1],  formTpPt[0], formBtPt1[1], edgescale );
    var forcePtD2 = new THREE.Vector3(forcePtB.x - forcePtD2temp.x, forcePtB.y - forcePtD2temp.y, forcePtB.z - forcePtD2temp.z);

    var dirAD= new THREE.Vector3(); // create once an reuse it

    dirAD.subVectors(forcePtA, forcePtD1).normalize();

    var dirBD = new THREE.Vector3(); // create once an reuse it

    dirBD.subVectors(forcePtD2, forcePtB).normalize();
    var forcePtD = LinesSectPt(dirAD, forcePtA, dirBD, forcePtB);
  } else{
    var forcePtD1temp = CalNormalVectorUpdated(formBtPt2[1], formTpPt[0], formBtPt3[1], edgescale );
    var forcePtD1 = new THREE.Vector3(forcePtA.x - forcePtD1temp.x, forcePtA.y - forcePtD1temp.y, forcePtA.z - forcePtD1temp.z);

    var forcePtD2temp = CalNormalVectorUpdated(formBtPt2[1],  formTpPt[0], formBtPt1[1], edgescale );
    var forcePtD2 = new THREE.Vector3(forcePtB.x - forcePtD2temp.x, forcePtB.y - forcePtD2temp.y, forcePtB.z - forcePtD2temp.z);
  
    var dirAD= new THREE.Vector3(); // create once an reuse it
  
    dirAD.subVectors(forcePtA, forcePtD1).normalize();
  
    var dirBD = new THREE.Vector3(); // create once an reuse it
  
    dirBD.subVectors(forcePtD2, forcePtB).normalize();
    var forcePtD = LinesSectPt(dirAD, forcePtA, dirBD, forcePtB);
  }

  var forcePtA_text = createSpriteText('A',"", new THREE.Vector3(forcePtA.x, forcePtA.y, forcePtA.z+0.05))
  force_general.add(forcePtA_text)
  var forcePtB_text = createSpriteText('B',"", new THREE.Vector3(forcePtB.x, forcePtB.y, forcePtB.z+0.05))
  force_general.add(forcePtB_text)
  var forcePtC_text = createSpriteText('C',"", new THREE.Vector3(forcePtC.x, forcePtC.y, forcePtC.z+0.05))
  force_general.add(forcePtC_text)
  if(forcePtD.z < 0){
    var forcePtD_text = createSpriteText('D',"", new THREE.Vector3(forcePtD.x, forcePtD.y, forcePtD.z-0.15))
    force_general.add(forcePtD_text)
  } else{
    var forcePtD_text = createSpriteText('D',"", new THREE.Vector3(forcePtD.x, forcePtD.y, forcePtD.z+0.1))
    force_general.add(forcePtD_text)
  }
  // face ABC
  var forceFaceABC = ForceFace3pt(forcePtA,forcePtB,forcePtC,0x014F06)
  force_group_f.add(forceFaceABC)
  var forceFaceABC2 = ForceFace3pt(forcePtA,forcePtB,forcePtC,0x014F06)
  force_general_global.add(forceFaceABC2)
  
  // *********************** caculating the areas of triangles (from the four points) *********************** 
 
  var areaABD = create_force_face_area(forcePtA,forcePtB,forcePtD);
  var areaBCD = create_force_face_area(forcePtB,forcePtC,forcePtD);
  var areaACD = create_force_face_area(forcePtA,forcePtC,forcePtD);

  var areaMax = Math.max(areaABD, areaBCD, areaACD);

  // *********************** caculating the normals for each triangle *********************** 

  // ****** caculating normals *******
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
  const forceCell = addCell4Face(forcePtD, forcePtA, forcePtB, forcePtC, forceCellScale )
  force_group_c.add(forceCell);
  force_group_c.traverse(function(obj) {
    if (obj.type === "Mesh") {
      obj.material.visible =false;
    }
  });

  // *********************** force edges **************************
  //testing the force edges
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

  const forceEdgeAD = createCylinderMesh(forcePtA,forcePtD,forceEdgeMaterial,edgeSize,edgeSize);

  force_group_e.add(forceEdgeAD)

  const forceEdgeBD = createCylinderMesh(forcePtB,forcePtD,forceEdgeMaterial,edgeSize,edgeSize);

  force_group_e.add(forceEdgeBD)

  const forceEdgeCD = createCylinderMesh(forcePtC,forcePtD,forceEdgeMaterial,edgeSize,edgeSize);

  force_group_e.add(forceEdgeCD)
  
  const endPtVerticePtA = addEdgeSphere(edgeSize, forcePtA, edgeColor)
  const endPtVerticePtB = addEdgeSphere(edgeSize, forcePtB, edgeColor)
  const endPtVerticePtC = addEdgeSphere(edgeSize, forcePtC, edgeColor)
  const endPtVerticePtD = addEdgeSphere(edgeSize, forcePtD, edgeColor)
  




  scene2.add(force_group_v);
  scene2.add(force_group_f);
  scene2.add(force_group_e);
  scene2.add(force_group_c);
  scene2.add(force_general);
  scene2.add(force_text);

  // *********************** form edges **************************
  var formedgeColor1, formedgeColor2, formedgeColor3

  if (resultapply>0){
   
    var edgeSize1 = areaABD * 0.05;
    var edgeSize2 = areaBCD * 0.05;
    var edgeSize3 = areaACD * 0.05;

    edgeSize1 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);
    edgeSize2 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);
    edgeSize3 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);

    var result1 = normalABD.dot(edgeVector1)
    var result2 = normalBCD.dot(edgeVector2)
    var result3 = normalCAD.dot(edgeVector3)

  } else{

    var edgeSize1 = areaBCD * 0.05;
    var edgeSize2 = areaABD * 0.05;
    var edgeSize3 = areaACD * 0.05;

    edgeSize1 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);
    edgeSize2 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);
    edgeSize3 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);

    var result1 = normalBCD.dot(edgeVector1)
    var result2 = normalABD.dot(edgeVector2)
    var result3 = normalCAD.dot(edgeVector3)

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

  function drawForceNormalsGlobal (forcePtA,forcePtB,forcePtC,normal_apply,normal_apply_outline,number){
    var normal_apply =new THREE.MeshPhongMaterial( {color: 0x009600} );
    var normal_apply_outline = new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );

    var forceABCcenter = face_center(forcePtA,forcePtB,forcePtC)
    if (ForceO1.z<0){
      var normal_arrow1 = createCylinderArrowMesh(
        new THREE.Vector3(forceABCcenter.x,forceABCcenter.y,forceABCcenter.z+0.4),
        forceABCcenter,
        normal_apply,0.02,0.05,0.56
        );

      force_general.add(normal_arrow1);
      var normal_arrow12 = createCylinderArrowMesh(
        new THREE.Vector3(forceABCcenter.x,forceABCcenter.y,forceABCcenter.z+0.405),
        new THREE.Vector3(forceABCcenter.x,forceABCcenter.y,forceABCcenter.z-0.025),
        normal_apply_outline,0.025,0.06,0.53
        );

      force_general.add(normal_arrow12);
      //add text
      var TXapplyNormal=createSpriteTextApply('n', number,  new THREE.Vector3(forceABCcenter.x,forceABCcenter.y,forceABCcenter.z+0.4));
      force_general.add(TXapplyNormal);
    } else{
      var normal_arrow1 = createCylinderArrowMesh(
        forceABCcenter,
        new THREE.Vector3(forceABCcenter.x,forceABCcenter.y,forceABCcenter.z-0.4),
        normal_apply,0.02,0.05,0.56
        );
  
      force_general.add(normal_arrow1);
      var normal_arrow12 = createCylinderArrowMesh(
        new THREE.Vector3(forceABCcenter.x,forceABCcenter.y,forceABCcenter.z+0.025),
        new THREE.Vector3(forceABCcenter.x,forceABCcenter.y,forceABCcenter.z-0.430),
        normal_apply_outline,0.025,0.06,0.53
        );
  
      force_general.add(normal_arrow12);
      //add text
      var TXapplyNormal=createSpriteTextApply('n', number,  new THREE.Vector3(forceABCcenter.x,forceABCcenter.y,forceABCcenter.z-0.535));
      force_general.add(TXapplyNormal);

    }
  }

  function drawForceNormals (forcePtA,forcePtB,forcePtC,edgePt1, edgePt2, normal_apply,normal_apply_outline,number){
    var forceFaceABDcenter = face_center(forcePtA,forcePtB,forcePtC)
    const endforceFaceABDa = subVecUpdated(edgePt1,edgePt2);
    var endforceFaceABDb = drawArrowfromVec(forceFaceABDcenter, endforceFaceABDa, 0.01)
    const endPtArrowABDb1 = addVectorAlongDir(forceFaceABDcenter,endforceFaceABDb,  0.01);
    const endPtArrowABDb2 = addVectorAlongDir(forceFaceABDcenter,endforceFaceABDb,  0.45);
    var ABDarrow1 = createCylinderArrowMesh( endPtArrowABDb1, endPtArrowABDb2,normal_apply,0.02,0.05,0.56);
    force_general.add(ABDarrow1);
    var ABDarrow12 = createCylinderArrowMesh( endPtArrowABDb1, endPtArrowABDb2,normal_apply_outline,0.025,0.06,0.56);
    force_general.add(ABDarrow12);
    var TXfaceNormal1 = createSpriteTextApply('n', number, new THREE.Vector3(endPtArrowABDb2.x,endPtArrowABDb2.y,endPtArrowABDb2.z+0.1));
    force_general.add(TXfaceNormal1);
  }

  function drawForceNormals2 (forcePtA,forcePtB,forcePtC,edgePt1, edgePt2, normal_apply,normal_apply_outline,number){
    var forceFaceABDcenter = face_center(forcePtA,forcePtB,forcePtC)
    const endforceFaceABDa = subVecUpdated(edgePt1,edgePt2);
    var endforceFaceABDb = drawArrowfromVec(forceFaceABDcenter, endforceFaceABDa, 0.01)
    const endPtArrowABDb1 = addVectorAlongDir(forceFaceABDcenter,endforceFaceABDb,  0.01);
    const endPtArrowABDb2 = addVectorAlongDir(forceFaceABDcenter,endforceFaceABDb,  0.45);
    var ABDarrow1 = createCylinderArrowMesh( endPtArrowABDb2, endPtArrowABDb1,normal_apply,0.02,0.05,0.56);
    force_general.add(ABDarrow1);
    var ABDarrow12 = createCylinderArrowMesh( endPtArrowABDb2, endPtArrowABDb1,normal_apply_outline,0.025,0.06,0.56);
    force_general.add(ABDarrow12);
    var TXfaceNormal1 = createSpriteTextApply('n', number, new THREE.Vector3(endPtArrowABDb2.x,endPtArrowABDb2.y,endPtArrowABDb2.z+0.1));
    force_general.add(TXfaceNormal1);
  }

  if (result1 < 0){
    if (resultapply>0){
      if (areaABD/areaMax >= 0.75){
        formedgeColor1 = 0x80002F
      }
      if (0.5 <= areaABD/areaMax & areaABD/areaMax < 0.75){
        formedgeColor1 = 0x940041
      }
      if (0.25 <= areaABD/areaMax & areaABD/areaMax  < 0.5){
        formedgeColor1 = 0xCC0549
      }
      if (0 <= areaABD/areaMax & areaABD/areaMax < 0.25){
        formedgeColor1 = 0xD72F62
      }
      var forceFaceABD = ForceFace3pt(forcePtA, forcePtB, forcePtD, formedgeColor1);
      
      var forceNormalMaterial=new THREE.MeshPhongMaterial( { 
        color:  formedgeColor1
      } );
      var forceNormalMaterialOutline=new THREE.MeshPhongMaterial( { 
        color: "white", transparent: false, side: THREE.BackSide 
        
      } );
     var forceFaceNormalABD = drawForceNormals (forcePtA,forcePtB,forcePtD,formBtPt1[1], formBtPt1[0],forceNormalMaterial,forceNormalMaterialOutline,"1");

    } else{
      if (areaBCD/areaMax >= 0.75){
        formedgeColor1 = 0x80002F
      }
      if (0.5 <= areaBCD/areaMax & areaBCD/areaMax  < 0.75){
        formedgeColor1 = 0x940041
      }
      if (0.25 <= areaBCD/areaMax & areaBCD/areaMax  < 0.5){
        formedgeColor1 = 0xCC0549
      }
      if (0 <= areaBCD/areaMax & areaBCD/areaMax < 0.25){
        formedgeColor1 = 0xD72F62
      }
      var forceFaceBCD = ForceFace3pt(forcePtB, forcePtC, forcePtD, formedgeColor1);
      var forceNormalMaterial=new THREE.MeshPhongMaterial( { 
        color:  formedgeColor1
      } );
      var forceNormalMaterialOutline=new THREE.MeshPhongMaterial( { 
        color: "white", transparent: false, side: THREE.BackSide 
        
      } );
     var forceFaceNormalBCD = drawForceNormals (forcePtB,forcePtC,forcePtD,formBtPt1[1], formBtPt1[0],forceNormalMaterial,forceNormalMaterialOutline,"1");
    }
  } else{
    if (resultapply>0){
      if (areaABD/areaMax >= 0.75){
        formedgeColor1 = 0x0F3150
      }
      if (0.5 <= areaABD/areaMax & areaABD/areaMax < 0.75){
        formedgeColor1 = 0x05416D
      }
      if (0.25 <= areaABD/areaMax & areaABD/areaMax  < 0.5){
        formedgeColor1 = 0x376D9B
      }
      if (0 <= areaABD/areaMax & areaABD/areaMax < 0.25){
        formedgeColor1 = 0x5B84AE
      }
      var forceFaceABD = ForceFace3pt(forcePtA, forcePtB, forcePtD, formedgeColor1);
      var forceNormalMaterial=new THREE.MeshPhongMaterial( { 
        color:  formedgeColor1
      } );
      var forceNormalMaterialOutline=new THREE.MeshPhongMaterial( { 
        color: "white", transparent: false, side: THREE.BackSide 
        
      } );
      var forceFaceNormalABD = drawForceNormals2 (forcePtA,forcePtB,forcePtD,formBtPt1[1], formBtPt1[0],forceNormalMaterial,forceNormalMaterialOutline,"1");

    } else{
      if (areaBCD/areaMax >= 0.75){
        formedgeColor1 = 0x0F3150
      }
      if (0.5 <= areaBCD/areaMax & areaBCD/areaMax  < 0.75){
        formedgeColor1 = 0x05416D
      }
      if (0.25 <= areaBCD/areaMax & areaBCD/areaMax  < 0.5){
        formedgeColor1 = 0x376D9B
      }
      if (0 <= areaBCD/areaMax & areaBCD/areaMax < 0.25){
        formedgeColor1 = 0x5B84AE
      }
      var forceFaceBCD = ForceFace3pt(forcePtB, forcePtC, forcePtD, formedgeColor1);
      var forceNormalMaterial=new THREE.MeshPhongMaterial( { 
        color:  formedgeColor1
      } );
      var forceNormalMaterialOutline=new THREE.MeshPhongMaterial( { 
        color: "white", transparent: false, side: THREE.BackSide 
        
      } );
      var forceFaceNormalBCD = drawForceNormals2 (forcePtB,forcePtC,forcePtD,formBtPt1[1], formBtPt1[0],forceNormalMaterial,forceNormalMaterialOutline,"1");

    }
  }
  var formEdge1Material=new THREE.MeshPhongMaterial( { 
    color:  formedgeColor1
  } );
  if (result2 < 0){
    if (resultapply>0){
      if (areaBCD/areaMax >= 0.75){
        formedgeColor2 = 0x80002F
      }
      if (0.5 <= areaBCD/areaMax & areaBCD/areaMax < 0.75){
        formedgeColor2 = 0x940041
      }
      if (0.25 <= areaBCD/areaMax & areaBCD/areaMax  < 0.5){
        formedgeColor2 = 0xCC0549
      }
      if (0 <= areaBCD/areaMax & areaBCD/areaMax < 0.25){
        formedgeColor2 = 0xD72F62
      }
      var forceFaceBCD = ForceFace3pt(forcePtB, forcePtC, forcePtD, formedgeColor2);
      var forceNormalMaterial=new THREE.MeshPhongMaterial( { 
        color:  formedgeColor2
      } );
      var forceNormalMaterialOutline=new THREE.MeshPhongMaterial( { 
        color: "white", transparent: false, side: THREE.BackSide 
        
      } );
      var forceFaceNormalBCD = drawForceNormals (forcePtB,forcePtC,forcePtD,formBtPt2[1], formBtPt1[0],forceNormalMaterial,forceNormalMaterialOutline,"2");

    } else{
      if (areaABD/areaMax >= 0.75){
        formedgeColor2 = 0x80002F
      }
      if (0.5 <= areaABD/areaMax & areaABD/areaMax  < 0.75){
        formedgeColor2 = 0x940041
      }
      if (0.25 <= areaABD/areaMax & areaABD/areaMax  < 0.5){
        formedgeColor2 = 0xCC0549
      }
      if (0 <= areaABD/areaMax & areaABD/areaMax < 0.25){
        formedgeColor2 = 0xD72F62
      }
      var forceFaceABD = ForceFace3pt(forcePtA, forcePtB, forcePtD, formedgeColor2);
      var forceNormalMaterial=new THREE.MeshPhongMaterial( { 
        color:  formedgeColor2
      } );
      var forceNormalMaterialOutline=new THREE.MeshPhongMaterial( { 
        color: "white", transparent: false, side: THREE.BackSide 
        
      } );
      var forceFaceNormalABD = drawForceNormals (forcePtA,forcePtB,forcePtD,formBtPt2[1], formBtPt1[0],forceNormalMaterial,forceNormalMaterialOutline,"2");


    }
  } else{
    if (resultapply>0){
      if (areaBCD/areaMax >= 0.75){
        formedgeColor2 = 0x0F3150
      }
      if (0.5 <= areaBCD/areaMax & areaBCD/areaMax < 0.75){
        formedgeColor2 = 0x05416D
      }
      if (0.25 <= areaBCD/areaMax & areaBCD/areaMax  < 0.5){
        formedgeColor2 = 0x376D9B
      }
      if (0 <= areaBCD/areaMax & areaBCD/areaMax < 0.25){
        formedgeColor2 = 0x5B84AE
      }
      var forceFaceBCD = ForceFace3pt(forcePtB, forcePtC, forcePtD, formedgeColor2);
      var forceNormalMaterial=new THREE.MeshPhongMaterial( { 
        color:  formedgeColor2
      } );
      var forceNormalMaterialOutline=new THREE.MeshPhongMaterial( { 
        color: "white", transparent: false, side: THREE.BackSide 
        
      } );
      var forceFaceNormalBCD = drawForceNormals2 (forcePtB,forcePtC,forcePtD,formBtPt2[1], formBtPt1[0],forceNormalMaterial,forceNormalMaterialOutline,"2");


    } else{
      if (areaABD/areaMax >= 0.75){
        formedgeColor2 = 0x0F3150
      }
      if (0.5 <= areaABD/areaMax & areaABD/areaMax  < 0.75){
        formedgeColor2 = 0x05416D
      }
      if (0.25 <= areaABD/areaMax & areaABD/areaMax  < 0.5){
        formedgeColor2 = 0x376D9B
      }
      if (0 <= areaABD/areaMax & areaABD/areaMax < 0.25){
        formedgeColor2 = 0x5B84AE
      }
      var forceFaceABD = ForceFace3pt(forcePtA, forcePtB, forcePtD, formedgeColor2);
      var forceNormalMaterial=new THREE.MeshPhongMaterial( { 
        color:  formedgeColor2
      } );
      var forceNormalMaterialOutline=new THREE.MeshPhongMaterial( { 
        color: "white", transparent: false, side: THREE.BackSide 
        
      } );
      var forceFaceNormalABD = drawForceNormals2 (forcePtA,forcePtB,forcePtD,formBtPt2[1], formBtPt1[0],forceNormalMaterial,forceNormalMaterialOutline,"2");



    }
  }
  var formEdge2Material=new THREE.MeshPhongMaterial( { 
    color:  formedgeColor2
  } );

  if (result3 < 0){
    if (areaACD/areaMax >= 0.75){
      formedgeColor3 = 0x80002F
    }
    if (0.5 <= areaACD/areaMax & areaACD/areaMax < 0.75){
      formedgeColor3 = 0x940041
    }
    if (0.25 <= areaACD/areaMax & areaACD/areaMax  < 0.5){
      formedgeColor3 = 0xCC0549
    }
    if (0 <= areaACD/areaMax & areaACD/areaMax < 0.25){
      formedgeColor3 = 0xD72F62
    }
    var forceFaceACD = ForceFace3pt(forcePtA, forcePtC, forcePtD, formedgeColor3);
    var forceNormalMaterial=new THREE.MeshPhongMaterial( { 
      color:  formedgeColor3
    } );
    var forceNormalMaterialOutline=new THREE.MeshPhongMaterial( { 
      color: "white", transparent: false, side: THREE.BackSide 
      
    } );
    var forceFaceNormalABD = drawForceNormals (forcePtA,forcePtB,forcePtD,formBtPt3[1], formBtPt1[0],forceNormalMaterial,forceNormalMaterialOutline,"2");



  } else{
    if (areaACD/areaMax >= 0.75){
      formedgeColor3 = 0x0F3150
    }
    if (0.5 <= areaACD/areaMax & areaACD/areaMax  < 0.75){
      formedgeColor3 = 0x05416D
    }
    if (0.25 <= areaACD/areaMax & areaACD/areaMax  < 0.5){
      formedgeColor3 = 0x376D9B
    }
    if (0 <= areaACD/areaMax & areaACD/areaMax < 0.25){
      formedgeColor3 = 0x5B84AE
    }
    var forceFaceACD = ForceFace3pt(forcePtA, forcePtC, forcePtD, formedgeColor3);

  }
  var formEdge3Material=new THREE.MeshPhongMaterial( { 
    color:  formedgeColor3
  } );

  force_group_f.add(forceFaceACD)
  force_group_f.add(forceFaceBCD)
  force_group_f.add(forceFaceABD)

  var forceFaceABDglob = ForceFace3pt(forcePtA,forcePtB,forcePtD,0x014F06)
  force_general_global.add(forceFaceABDglob)
  var forceFaceBCDglob = ForceFace3pt(forcePtB,forcePtC,forcePtD,0x014F06)
  force_general_global.add(forceFaceBCDglob)
  var forceFaceACDglob = ForceFace3pt(forcePtA,forcePtC,forcePtD,0x014F06)
  force_general_global.add(forceFaceACDglob)



  //create end sphere for bottom vertice 1
  const endPtVertice1SpV = addVectorAlongDir(formBtPt1[1], formTpPt[0], -0.14);
  const endPtVertice1Sp = addEdgeSphere(edgeSize1, endPtVertice1SpV, formedgeColor1)
  //create edge bottom vertice 1
  const endPtVertice1 = addVectorAlongDir(formTpPt[0],formBtPt1[1],  -0.1);
  const formEdge1 = createCylinderMesh(endPtVertice1SpV,endPtVertice1,formEdge1Material,edgeSize1,edgeSize1);

  form_group_e.add(endPtVertice1Sp)
  form_group_e.add(formEdge1)

  //create end sphere for bottom vertice 2
  const endPtVertice2SpV = addVectorAlongDir(formBtPt2[1], formTpPt[0], -0.14);
  const endPtVertice2Sp = addEdgeSphere(edgeSize2, endPtVertice2SpV, formedgeColor2)
  //create edge bottom vertice 2
  const endPtVertice2 = addVectorAlongDir(formTpPt[0],formBtPt2[1],  -0.1);
  const formEdge2 = createCylinderMesh(endPtVertice2SpV,endPtVertice2,formEdge2Material,edgeSize2,edgeSize2);

  form_group_e.add(endPtVertice2Sp)
  form_group_e.add(formEdge2)

  //create end sphere for bottom vertice 3
  const endPtVertice3SpV = addVectorAlongDir(formBtPt3[1], formTpPt[0], -0.14);
  const endPtVertice3Sp = addEdgeSphere(edgeSize3, endPtVertice3SpV, formedgeColor3)
  //create edge bottom vertice 3
  const endPtVertice3 = addVectorAlongDir(formTpPt[0],formBtPt3[1],  -0.1);
  const formEdge3 = createCylinderMesh(endPtVertice3SpV,endPtVertice3,formEdge3Material,edgeSize3,edgeSize3);

  form_group_e.add(endPtVertice3Sp)
  form_group_e.add(formEdge3)
 

  form_general_global.traverse(function(obj) {
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

  force_general_global.traverse(function(obj) {
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



  scene.add(form_group_v);
  scene.add(form_group_f);
  scene.add(form_group_e);
  scene.add(form_group_c);
  scene.add(form_general);


  scene.add(form_group_v);
  scene.add(form_group_f);
  scene.add(form_group_e);
  scene.add(form_group_c);
  scene.add(form_general);
  scene.add(form_general_global);
  scene.add(form_group_e_trial);
  scene.add(form_general_trial);
  scene.add(form_group_mink);

  scene2.add(force_group_v);
  scene2.add(force_group_f);
  scene2.add(force_group_e);
  scene2.add(force_group_c);
  scene2.add(force_general);
  scene2.add(force_general_global);

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
        formBtPt1[1].x=selectObj.position.x;
        formBtPt1[1].y=selectObj.position.y;
        formBtPt1[1].z=selectObj.position.z;
      }

      if(selectObj.name.charAt(2)==='2')
      {
        formBtPt2[1].x=selectObj.position.x;
        formBtPt2[1].y=selectObj.position.y;
        formBtPt2[1].z=selectObj.position.z;
      }

      if(selectObj.name.charAt(2)==='3')
      {
        formBtPt3[1].x=selectObj.position.x;
        formBtPt3[1].y=selectObj.position.y;
        formBtPt3[1].z=selectObj.position.z;
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
        trfm_ctrl.position.update();
        console.log(selectObj.position)
        console.log(trfm_ctrl.position)
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


function create_force_face_area(point1,point2,pointO){
    var face_area = new THREE.Vector3().crossVectors(
       new THREE.Vector3().subVectors( point1, pointO ),
       new THREE.Vector3().subVectors( point2, pointO ),
       ).length()/2

    return face_area
}


function subVec(n1, n2) {
    var sub = new THREE.Vector3(0, 0, 0);
    sub.x = n1.x - n2.x;
    sub.y = n1.y - n2.y;
    sub.z = n1.z - n2.z;
    return sub;
}

function drawArrowfromVec (startPt, endPt, length){
  var vector = new THREE.Vector3();
  vector = new THREE.Vector3(startPt.x - length * endPt.x, startPt.y - length * endPt.y, startPt.z - length * endPt.z);
  return vector
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
            transparent: true, 
            opacity: 0.8, 
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



function face_center(n1,n2,n3){

    var face_centerD=new THREE.Vector3();

        face_centerD.x=(n1.x+n2.x+n3.x)/3;
        face_centerD.y=(n1.y+n2.y+n3.y)/3;
        face_centerD.z=(n1.z+n2.z+n3.z)/3;

        return face_centerD;

}

    
function createSpriteText(text,text2, pos){
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
  ctx.fillText(text2,190,157);

  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  //text
  var material = new THREE.SpriteMaterial({ map: texture, depthWrite:false });
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

function createSpriteTextApply(text,text2, pos){
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
  ctx.fillText(text2,200,157);

  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  //text
  var material = new THREE.SpriteMaterial({ map: texture, depthWrite:false });
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

function createSpriteTextNormal(text,text2,text3,pos){
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
  ctx.fillText(text2,200,157);

  ctx.fillStyle = "black";
  ctx.font = "25px Palatino";
  ctx.lineWidth = 2;
  ctx.fillText(text3,240,150);

  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  //text
  var material = new THREE.SpriteMaterial({ map: texture, depthWrite:false });
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



function createSpriteTextPrime(text,text2, pos){
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
  ctx.fillText(text2,210,110);

  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  //text
  var material = new THREE.SpriteMaterial({ map: texture, depthWrite:false });
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

function createCircleFaceArrow(centerPt,radius,arr_dir)
{
  var Vec_a=cross(arr_dir,new THREE.Vector3(1,0,0)); 
  if(Vec_a.x===0&&Vec_a.y===0&&Vec_a.z===0)
  {
    Vec_a=cross(arr_dir,new THREE.Vector3(0,1,0));
  }
  var Vec_b=cross(arr_dir,Vec_a);
  Vec_a.normalize();
  Vec_b.normalize();
  // console.log("vec_a,vec_b",Vec_a,Vec_b);
  var points = [];
  var length = 20;
  for (var i = 0; i <= length; i++)
  {
    var Pts_Circle=new THREE.Vector3(0,0,0);
    Pts_Circle.x=centerPt.x + radius*Vec_a.x*Math.cos(Math.PI*1.5*i/length) + radius*Vec_b.x*Math.sin(Math.PI*1.5*i/length);
    Pts_Circle.y=centerPt.y + radius*Vec_a.y*Math.cos(Math.PI*1.5*i/length) + radius*Vec_b.y*Math.sin(Math.PI*1.5*i/length);
    Pts_Circle.z=centerPt.z + radius*Vec_a.z*Math.cos(Math.PI*1.5*i/length) + radius*Vec_b.z*Math.sin(Math.PI*1.5*i/length);
    points.push(Pts_Circle);
  }
  var geometrySpacedPoints = new THREE.BufferGeometry().setFromPoints(points);
  //var line2 = new THREE.Line( geometrySpacedPoints, material);
  var arcMaterial = new THREE.LineDashedMaterial({
    color: 0x00ff00,
    dashSize: 0.1,
    gapSize: 0.05
  });
  var CircleMesh = new THREE.Line(geometrySpacedPoints,arcMaterial);
  //console.log("points=",points[1],points[5]);
  CircleMesh.computeLineDistances();//dash
  var arrow_material1=new THREE.MeshBasicMaterial( {
    color:  "white"//green
  } );
  // var CircleMesh=createCylinderMesh(points[0],points[1],arrow_material1,0.02,0.02);
  for(i=0;i<length;i++)
  {
    var CircleMesh1=createCylinderMesh(points[i],points[i+1],arrow_material1,0.005,0.005);
    CircleMesh1.castShadow = false;
    CircleMesh.add(CircleMesh1);
  }
  var Arr_Pt1=new THREE.Vector3(0,0,0);
  Arr_Pt1.x=centerPt.x + radius*Vec_a.x*Math.cos(Math.PI*1.6*i/length) + radius*Vec_b.x*Math.sin(Math.PI*1.6*i/length);
  Arr_Pt1.y=centerPt.y + radius*Vec_a.y*Math.cos(Math.PI*1.6*i/length) + radius*Vec_b.y*Math.sin(Math.PI*1.6*i/length);
  Arr_Pt1.z=centerPt.z + radius*Vec_a.z*Math.cos(Math.PI*1.6*i/length) + radius*Vec_b.z*Math.sin(Math.PI*1.6*i/length);
  var face_arrow1=createCylinderArrowMesh(points[length],Arr_Pt1,arrow_material1,0.01,0.02,0.01);
  CircleMesh.add(face_arrow1);
  return CircleMesh;
}