import * as THREE from "three";
import Ground from "./Ground.js";
import Armazem from "./Armazem.js";
import Base from "./Base.js";
import Arco from "./Arco.js";
import { GLTFLoader } from './three.js-master/examples/jsm/loaders/GLTFLoader.js';
import Camiao from "./Camiao.js";
import CamiaoAutomatico from "./CamiaoAutomatico.js"

export default class View {
    constructor() {
        let estradas = [];
        let isValidPosition = false;
        let armazens = [];
        let armazemreal1 = null;
        let armazemreal2 = null;
        function OnLoad(view) {

            let txt = getWarehouses();
            view.object = new THREE.Group();
            let size = 200;
            view.ground = new Ground(size);
            view.object.add(view.ground.object);

            let coordinates = handleJSON_warehouses(txt, view);

            for (var i = 1; i < coordinates.length; i++) {
                view.armazem = new Armazem();
                let armazem1 = view.armazem.object;
                armazem1.idArmazem = i;
                armazem1.bases = [];
                armazem1.position.set(coordinates[i][0], coordinates[i][1], coordinates[i][2]);
                armazem1.children[0].userData.description = "Id:" + i + "<br>Name:" + coordinates[i][3];
                view.object.add(armazem1);
                armazens[i] = armazem1;
                console.log(armazens);
                warehouseModel3D(coordinates[i][0], coordinates[i][1], coordinates[i][2], view);
                console.log(armazens[i].position.x);
            }
            let jsonTrucks = getTrucks();
            let trucksInfo = handleJSON_trucks(jsonTrucks, view);

            view.bola = new Camiao();
            let bola = view.bola.object;
            bola.position.set(armazens[5].position.x, armazens[5].position.y + 0.2, armazens[5].position.z);
            view.object.add(bola);

            console.log(trucksInfo);

            //view.object.add(camiao);


            // ...
            let bridges = [];

            view.base = new Base();
            bridges.push(createBridge(view, armazens[1], armazens[16]));
            bridges.push(createBridge(view, armazens[16], armazens[3]));
            bridges.push(createBridge(view, armazens[2], armazens[9]));
            bridges.push(createBridge(view, armazens[2], armazens[15]));
            bridges.push(createBridge(view, armazens[3], armazens[10]));
            bridges.push(createBridge(view, armazens[3], armazens[5]));
            bridges.push(createBridge(view, armazens[4], armazens[6]));
            bridges.push(createBridge(view, armazens[4], armazens[9]));
            bridges.push(createBridge(view, armazens[16], armazens[14]));
            bridges.push(createBridge(view, armazens[8], armazens[13]));
            bridges.push(createBridge(view, armazens[7], armazens[5]));//
            bridges.push(createBridge(view, armazens[17], armazens[13]));
            bridges.push(createBridge(view, armazens[12], armazens[1]));
            bridges.push(createBridge(view, armazens[8], armazens[5]));
            bridges.push(createBridge(view, armazens[10], armazens[11]));
            bridges.push(createBridge(view, armazens[14], armazens[7]));
            bridges.push(createBridge(view, armazens[15], armazens[8]));
            bridges.push(createBridge(view, armazens[6], armazens[11]));
            bridges.push(createBridge(view, armazens[9], armazens[6]));
            bridges.push(createBridge(view, armazens[12], armazens[7]));
            bridges.push(createBridge(view, armazens[5], armazens[17]));
            bridges.push(createBridge(view, armazens[15], armazens[1]));
            bridges.push(createBridge(view, armazens[13], armazens[10]));
            bridges.push(createBridge(view, armazens[4], armazens[11]));
            bridges.push(createBridge(view, armazens[16], armazens[12]));
            estradas.push(5, 17, 1, 16, 16, 3, 2, 9, 2, 15, 3, 10, 3, 5, 4, 6, 4, 9, 16, 14, 8, 13, 7, 5, 17, 13, 12, 1, 8, 5, 10, 11, 14, 7, 15, 8, 6, 11, 9, 6, 12, 7, 15, 1, 13, 10, 4, 11, 16, 12);
            console.log("x 5 is" + armazens[5].position.x);
            console.log("x 17 is" + armazens[17].position.x);
            console.log("Y 5 is" + armazens[5].position.z);
            console.log("Y 17 is" + armazens[17].position.z);
            bola.rotateY(Math.PI);
            let angle = 0;
            let directionside = 0;
            let directionfront = 0;
            let directionupdown = 0;
            let speed = 0.1;
            let rotationIndex = Math.PI / 64;
            let updates = false;
            // Create the button element
            var button = document.createElement('button');
            button.innerHTML = 'Create automatic trucks';

            // Add the button to the container
            var container = document.getElementById('button-container');
            container.appendChild(button);

            // Add an event listener to the button
            button.addEventListener('click', function () {

                let destWarehouseList = [armazens[7], bridges[10], armazens[5], bridges[20], armazens[17], bridges[11], armazens[13]];
                view.bola = new CamiaoAutomatico();
                let camiaoAutomatico = view.bola.object;
                view.object.add(camiaoAutomatico);
                move(camiaoAutomatico, destWarehouseList);
                //}
            });
            window.addEventListener("keydown", event => {
                if (event.code === "KeyW") {
                    console.log("W");
                    directionside = -1;
                    updates = true;
                } else if (event.code === "KeyS") {
                    console.log("S");
                    directionside = 1;
                    updates = true;
                } else if (event.code === "KeyA") {
                    console.log("A");
                    directionfront = 1;
                    updates = true;
                } else if (event.code === "KeyD") {
                    console.log("D");
                    directionfront = -1;
                    updates = true;
                } else if (event.code === "KeyE") {
                    directionupdown = 1;
                    updates = true;
                } else if (event.code === "KeyQ") {
                    directionupdown = -1;
                    updates = true;
                }
            });


            function percentagem(armazem1x, armazem2x, armazem1y, armazem2y, armazem1z, armazem2z, newX, newY) {
                let armazem3x, armazem3y, armazem4y, armazem4x, zmaior, zmaispiqui, ymaior, ymaispiqui;
                let ladox, ladoy, ladoxpequeno, ladoypequeno, ladoz, distanciaEntreArmazens;
                if (armazem1x == bola.position.x && armazem1y == bola.position.z) {
                    bola.position.y = armazem1z;
                }
                if (armazem2x == bola.position.x && armazem2y == bola.position.z) {
                    bola.position.y = armazem2z;
                }
                if (armazem1x >= armazem2x) {
                    armazem3x = armazem1x;
                    armazem3y = armazem1y;
                    armazem4x = armazem2x;
                    armazem4y = armazem2y;
                }
                else { armazem3x = armazem2x; armazem4x = armazem1x; armazem3y = armazem2y; armazem4y = armazem1y; }
                if (armazem1y >= armazem2y) { ymaior = armazem1y; ymaispiqui = armazem2y; }
                if (armazem1y < armazem2y) { ymaior = armazem2y; ymaispiqui = armazem1y; }
                if (armazem1z <= armazem2z) { zmaior = armazem2z; zmaispiqui = armazem1z; }
                if (armazem1z > armazem2z) { zmaior = armazem1z; zmaispiqui = armazem2z; }

                
                ladox = armazem3x - armazem4x;
                ladoy = armazem3y - armazem4y;
                ladoz = zmaior - zmaispiqui;
                
                ladoxpequeno = newX - armazem4x;
                ladoypequeno = newY - armazem4y;
                distanciaEntreArmazens = ladoxpequeno / ladox;
                let distanciaEntreArmazens2 = ladoypequeno / ladoy;

                
                if (Math.abs(distanciaEntreArmazens - distanciaEntreArmazens2) <= 0.05 && newX <= armazem3x && newX >= armazem4x && newY <= ymaior && newY >= ymaispiqui && Math.abs(bola.position.y - (ladoz * distanciaEntreArmazens + zmaispiqui)) < 1) {

                    bola.position.y = 1 - (ladoz * distanciaEntreArmazens) + zmaispiqui;

                    return true;
                }
              
                return false;
            }
            function updatePosition() {

                let i = 0;
                if (updates) {
                    if (directionside < 0) {
                        let newpositionx;
                        let newpositiony;
                        if (0 <= angle && angle < Math.PI / 2) {
                            newpositionx = bola.position.x + speed * -Math.sin(angle);
                            newpositiony = bola.position.z + speed * -Math.cos(angle);
                        }
                        if (Math.PI / 2 <= angle && angle < Math.PI) {
                            newpositionx = bola.position.x - speed * Math.sin(angle);
                            newpositiony = bola.position.z + speed * -Math.cos(angle);
                        }
                        if (Math.PI <= angle && angle < Math.PI * 1.5) {
                            newpositionx = bola.position.x - speed * Math.sin(angle);
                            newpositiony = bola.position.z - speed * Math.cos(angle);
                        }
                        if (Math.PI * 1.5 <= angle && angle < Math.PI * 2) {
                            newpositionx = bola.position.x + speed * -Math.sin(angle);
                            newpositiony = bola.position.z - speed * Math.cos(angle);
                        }
                        if (armazemreal1 == null) {
                            for (i = 0; i < estradas.length; i = i + 2) {

                                let armazem1 = armazens[estradas[i]];
                                let armazem2 = armazens[estradas[i + 1]];
                                if (percentagem(armazem1.position.x, armazem2.position.x, armazem1.position.z, armazem2.position.z, armazem1.position.y, armazem2.position.y, newpositionx, newpositiony)) {
                                    armazemreal1 = armazem1;
                                    armazemreal2 = armazem2;
                                    bola.position.x = newpositionx;
                                    bola.position.z = newpositiony;
                                    updates = false;
                                    directionside = 0;
                                    console.log("estrada nova");
                                    break;
                                }
                            }
                        } else {
                            if (percentagem(armazemreal1.position.x, armazemreal2.position.x, armazemreal1.position.z, armazemreal2.position.z, armazemreal1.position.y, armazemreal2.position.y, newpositionx, newpositiony)) {
                                bola.position.x = newpositionx;
                                bola.position.z = newpositiony;
                                updates = false;
                                directionside = 0;
                            }
                            if ((Math.abs(bola.position.x - armazemreal1.position.x) <= 0.6 && Math.abs(bola.position.z - armazemreal1.position.z) <= 0.6) || (Math.abs(bola.position.x - armazemreal2.position.x) <= 0.6 && Math.abs(bola.position.z - armazemreal2.position.z) <= 0.6)) {
                                armazemreal1 = null;
                                armazemreal2 = null;
                                console.log("acabou a estrada");
                            }
                        }
                    }
                    if (directionside > 0) {
                        let newpositionx;
                        let newpositiony;
                        if (0 <= angle && angle < Math.PI / 2) {
                            newpositionx = bola.position.x - speed * -Math.sin(angle);
                            newpositiony = bola.position.z - speed * -Math.cos(angle);
                        }
                        if (Math.PI / 2 <= angle && angle < Math.PI) {
                            newpositionx = bola.position.x + speed * Math.sin(angle);
                            newpositiony = bola.position.z - speed * -Math.cos(angle);
                        }
                        if (Math.PI <= angle && angle < Math.PI * 1.5) {
                            newpositionx = bola.position.x + speed * Math.sin(angle);
                            newpositiony = bola.position.z + speed * Math.cos(angle);
                        }
                        if (Math.PI * 1.5 <= angle && angle < Math.PI * 2) {
                            newpositionx = bola.position.x - speed * -Math.sin(angle);
                            newpositiony = bola.position.z + speed * Math.cos(angle);
                        }
                        if (armazemreal1 == null) {
                            for (i = 0; i < estradas.length; i = i + 2) {

                                let armazem1 = armazens[estradas[i]];
                                let armazem2 = armazens[estradas[i + 1]];
                                if (percentagem(armazem1.position.x, armazem2.position.x, armazem1.position.z, armazem2.position.z, armazem1.position.y, armazem2.position.y, newpositionx, newpositiony)) {
                                    armazemreal1 = armazem1;
                                    armazemreal2 = armazem2;
                                    bola.position.x = newpositionx;
                                    bola.position.z = newpositiony;
                                    updates = false;
                                    directionside = 0;
                                    console.log("estrada nova");
                                    break;
                                }
                            }
                        } else {
                            if (percentagem(armazemreal1.position.x, armazemreal2.position.x, armazemreal1.position.z, armazemreal2.position.z, armazemreal1.position.y, armazemreal2.position.y, newpositionx, newpositiony)) {
                                bola.position.x = newpositionx;
                                bola.position.z = newpositiony;
                                updates = false;
                                directionside = 0;
                            }
                            if ((Math.abs(bola.position.x - armazemreal1.position.x) <= 0.6 && Math.abs(bola.position.z - armazemreal1.position.z) <= 0.6) || (Math.abs(bola.position.x - armazemreal2.position.x) <= 0.6 && Math.abs(bola.position.z - armazemreal2.position.z) <= 0.6)) {
                                armazemreal1 = null;
                                armazemreal2 = null;
                                console.log("acabou a estrada");
                            }
                        }
                    }
                }
                if (directionfront > 0) { bola.rotateY(rotationIndex); directionfront = 0; angle = angle + rotationIndex; if (angle == Math.PI * 2) { angle = 0; } }
                if (directionfront < 0) { bola.rotateY(-rotationIndex); directionfront = 0; angle = angle - rotationIndex; if (angle < 0) { angle = Math.PI * 2 - rotationIndex; } }
                if (directionupdown > 0) { bola.rotateZ(rotationIndex); directionupdown = 0; }
                if (directionupdown < 0) { bola.rotateZ(-rotationIndex); directionupdown = 0; }
                requestAnimationFrame(draw);
            }

            function draw() { updatePosition(); }

            requestAnimationFrame(draw);

        }


        function getWarehouses() {
            var txt = '';
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                    txt = xmlhttp.responseText;
                }
            };
            xmlhttp.open("GET", "https://localhost:5001/api/Warehouses", false);
            xmlhttp.send();
            var txt2 = JSON.parse(txt);
            console.log(txt2);
            return txt2;
        }

        function getTrucks() {
            var txt = '';
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                    txt = xmlhttp.responseText;
                }
            };
            xmlhttp.open("GET", "http://localhost:2223/api/Trucks", false);
            xmlhttp.send();
            var txt2 = JSON.parse(txt);
            console.log(txt2);
            return txt2;
        }

        function getDeliveries() {
            var txt = '';
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                    txt = xmlhttp.responseText;
                }
            };
            xmlhttp.open("GET", "http://localhost:2223/api/travels", false);
            xmlhttp.send();
            var txt2 = JSON.parse(txt);
            console.log(txt2);
            return txt2;
        }

        function createBridge(view, armazem1, armazem2) {
            let base1 = view.base.object.clone();
            view.object.add(base1);

            let base2 = view.base.object.clone();
            view.object.add(base2);
            base1.armazemDestino = armazem2.idArmazem;
            armazem1.bases.push(base1);
            armazem1.add(base1);
            base2.armazemDestino = armazem1.idArmazem;
            armazem2.bases.push(base2);
            armazem2.add(base2);

            if (armazem1.position.y - armazem2.position.y < 0) {
                let base3 = base1;
                base1 = base2;
                base2 = base3;
                let armazem3 = armazem1;
                armazem1 = armazem2;
                armazem2 = armazem3;
            }
            let angles = pointEachOther(armazem1, armazem2, base1, base2);

            let extreme1 = findExtreme(armazem1, armazem2);
            let extreme2 = findExtreme(armazem2, armazem1);

            extreme1[0] = armazem1.position.x + extreme1[0];
            extreme1[1] = armazem1.position.y + 0.25;
            extreme1[2] = armazem1.position.z + extreme1[2];
            //um pouco a trolha, descobrir como por isto um pouco mais em condicoes estas 6 linhas
            extreme2[0] = armazem2.position.x + extreme2[0];
            extreme2[1] = armazem2.position.y + 0.25;
            extreme2[2] = armazem2.position.z + extreme2[2];

            let p = Math.sqrt(Math.pow(extreme1[0] - extreme2[0], 2) + Math.pow(extreme1[1] - extreme2[1], 2) + Math.pow(extreme1[2] - extreme2[2], 2));
            let desnivel = extreme1[1] - extreme2[1];
            if (desnivel > 2) {
                p += 0.2;
                view.arco = new Arco(p + 0.20, armazem1, armazem2);
                p -= 2;
            } else {
                p += 0.3;
                view.arco = new Arco(p + 0.30, armazem1, armazem2);
                p -= 2;
            }
            let arco1;
            arco1 = view.arco.object.clone();
            view.object.add(arco1);

            const rotationHorizontal = angles[0];
            arco1.rotateY(rotationHorizontal);
            arco1.rotationHorizontal = rotationHorizontal;
            arco1.position.set((extreme1[0] + extreme2[0]) / 2, (extreme1[1] + extreme2[1] - 0.05) / 2, (extreme1[2] + extreme2[2]) / 2);
            const rotationVertical = -Math.atan(desnivel / (p));
            arco1.rotateZ(rotationVertical);
            arco1.rotationVertical = rotationVertical;
            arco1.armazemOrigem = view.arco.armazemOrigem;
            arco1.armazemDestino = view.arco.armazemDestino;
            arco1.size = view.arco.size;
            arco1.width = view.arco.width;
            return arco1;
        }

        function pointEachOther(armazem, armazem1, base1, base2) {
            if (armazem.position.x - armazem1.position.x > 0) {
                let degrees = Math.atan2(armazem.position.x - armazem1.position.x, armazem.position.z - armazem1.position.z);
                base1.rotateY(degrees + Math.PI / 2);
                base1.rotacao = degrees + Math.PI / 2;
                base2.rotateY(-(Math.PI / 2 - degrees));
                base2.rotacao = -(Math.PI / 2 - degrees);
                let numbers = [];
                numbers.push(degrees + Math.PI / 2);
                numbers.push(-(Math.PI / 2 - degrees))

                return numbers;
            } else {
                let degrees = Math.atan2(armazem.position.x - armazem1.position.x, armazem.position.z - armazem1.position.z);
                base2.rotateY(degrees - Math.PI / 2);
                base2.rotacao = degrees - Math.PI / 2;
                base1.rotateY((Math.PI / 2 + degrees));
                base1.rotacao = (Math.PI / 2 + degrees);

                let numbers = [];
                numbers.push((Math.PI / 2 + degrees));
                numbers.push(degrees - Math.PI / 2);


                return numbers;
            }
        }

        function findExtreme(armazem1, armazem2) {
            let V = [armazem2.position.x - armazem1.position.x, armazem2.position.y - armazem1.position.y, armazem2.position.z - armazem1.position.z];
            let vNorm = Math.sqrt(Math.pow(V[0], 2) + Math.pow(V[1], 2) + Math.pow(V[2], 2));
            let i;
            for (i = 0; i < 3; i++) {
                V[i] = V[i] / vNorm * 0.2;
            }
            return V;
        }
        function longTox(longitude) {
            return ((100 / 0.5162) * (longitude - 8.2451) - 50) * 15 / 50;
        }
        function latToz(latitude) {
            return ((100 / 1.2728) * (latitude - 40.8387) - 50) * 15 / 50;
        }
        function altToy(alt) {
            return (50 / 800 * alt) / 10;
        }
        function handleJSON_warehouses(txt) {
            let coordinates = new Array(txt.length + 1);
            for (var i = 0; i < txt.length; i++) {
                var id = (txt[i].id);
                coordinates[id] = new Array(3);
                var x = longTox(txt[i].longitude);
                var y = altToy(txt[i].altitude);
                var z = latToz(txt[i].latitude);
                var description = (txt[i].description);
                coordinates[id][0] = x;
                coordinates[id][1] = y;
                coordinates[id][2] = z;
                coordinates[id][3] = description;
            }
            return coordinates;
        }
        function handleJSON_trucks(txt) {
            let trucksInfo = new Array(txt.length + 1);
            for (var i = 0; i < txt.length; i++) {
                var id = (txt[i].id);
                trucksInfo[id] = new Array(6);
                trucksInfo[id][0] = txt[i].plate;
                trucksInfo[id][1] = txt[i].tare;
                trucksInfo[id][2] = txt[i].maxWeight;
                trucksInfo[id][3] = txt[i].batteryCapacity;
                trucksInfo[id][4] = txt[i].truckAutonomy;
                trucksInfo[id][5] = txt[i].chargeTime;
            }
            return trucksInfo;
        }
        function warehouseModel3D(x, y, z, view) {

            const loader = new GLTFLoader();
            loader.load('assets/warehouse.glb', (gltf) => {
                const root = gltf.scene;
                gltf.scene.scale.set(0.007, 0.007, 0.007);
                root.position.setX(x);
                root.position.setY(y + 0.1);
                root.position.setZ(z);
                view.object.add(root);
            });
        }
        function truckModel3D(x, y, z, view) {

            const loader = new GLTFLoader();
            loader.load('assets/truck.glb', (gltf) => {
                const root = gltf.scene;
                gltf.scene.scale.set(0.07, 0.07, 0.07);
                root.position.setX(x + 0.65);
                root.position.setY(y + 0.25);
                root.position.setZ(z);
                view.object.add(root);
            })
        }
        OnLoad(this);
        //nao sei
        function calculateposition(currentX, currentY, currentZ, angle) {
            let finalX;
            let finalY;
            let finalZ;
            Math.pow(1 / Math.cos(angle), 2) - solve(1, -2 * currentX, Math.pow(currentX));
        }
        function solve(a, b, c) {
            var result = (-1 * b + Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a);
            var result2 = (-1 * b - Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a);
            return result;
        }
        async function move(camiaoAutomatico, percurso) {
            camiaoAutomatico.percurso = percurso;
            camiaoAutomatico.baseLength = 1; //ver se pode ser buscada a base do armazem
            camiaoAutomatico.baseWidth = 0.25; // ver se pode ser buscada a base do armazem
            camiaoAutomatico.rotundaRaio = 0.8; //this.percurso[0].raio

            camiaoAutomatico.K_BERMA = 0.25;
            camiaoAutomatico.b = camiaoAutomatico.K_BERMA * camiaoAutomatico.percurso[1].width;
            camiaoAutomatico.RAIO_ROTACAO = camiaoAutomatico.b * 0.75;  //ainda por ver

            camiaoAutomatico.hip = camiaoAutomatico.rotundaRaio - camiaoAutomatico.b + camiaoAutomatico.RAIO_ROTACAO;
            camiaoAutomatico.catTrans = (camiaoAutomatico.baseWidth / 2) - camiaoAutomatico.b + camiaoAutomatico.RAIO_ROTACAO;
            camiaoAutomatico.teta = Math.acos(camiaoAutomatico.catTrans / camiaoAutomatico.hip);
            
            camiaoAutomatico.catLong = Math.sqrt(Math.pow(camiaoAutomatico.hip, 2) - Math.pow(camiaoAutomatico.catTrans, 2));
            camiaoAutomatico.lIJ = camiaoAutomatico.baseLength - camiaoAutomatico.catLong;

            camiaoAutomatico.n = 0;
            camiaoAutomatico.vela = 0;
            camiaoAutomatico.velh = 0;
            camiaoAutomatico.velv = 0;

            initializeCamiaoAutomatico();
            camiaoAutomatico.update = true;
            updateCamiaoAutomatico();

            function initializeCamiaoAutomatico() {
                camiaoAutomatico.i = 2;
                camiaoAutomatico.nI = camiaoAutomatico.percurso[camiaoAutomatico.i - 2];
                camiaoAutomatico.ponteIJ = camiaoAutomatico.percurso[camiaoAutomatico.i - 1];
                camiaoAutomatico.nJ = camiaoAutomatico.percurso[camiaoAutomatico.i];

                let rotacao;
                for (let j = 0; j < camiaoAutomatico.nJ.bases.length; j++) {
                    if (camiaoAutomatico.nJ.bases[j].armazemDestino == camiaoAutomatico.nI.idArmazem) {
                        rotacao = camiaoAutomatico.nJ.bases[j].rotacao;
                        break;
                    }
                }

                camiaoAutomatico.direcao = rotacao - camiaoAutomatico.teta + Math.PI - 0.35;
                camiaoAutomatico.xN = camiaoAutomatico.nJ.position.x + (camiaoAutomatico.rotundaRaio - camiaoAutomatico.b) * Math.sin(camiaoAutomatico.direcao);
                camiaoAutomatico.yN = camiaoAutomatico.nJ.position.y + 0.3; //este 0.3 = ALTURA_PERSONAGEM / 2
                camiaoAutomatico.zN = camiaoAutomatico.nJ.position.z - ((camiaoAutomatico.rotundaRaio) - camiaoAutomatico.b) * Math.cos(camiaoAutomatico.direcao);
                camiaoAutomatico.position.set(camiaoAutomatico.xN, camiaoAutomatico.yN, camiaoAutomatico.zN);
                camiaoAutomatico.rotateY(camiaoAutomatico.direcao-Math.PI/2);
            }

            async function updateCamiaoAutomatico() {
                while (camiaoAutomatico.update) {
                    setMovimentoA();
                    for (let i = 0; i < camiaoAutomatico.n; i++) {
                        await animacao();
                    }

                    setMovimentoB();
                    for (let i = 0; i < camiaoAutomatico.n; i++) {
                        await animacao();
                    }

                    setMovimentoC();
                    for (let i = 0; i < camiaoAutomatico.n; i++) {
                        await animacao();
                    }

                    camiaoAutomatico.i += 1;

                    setMovimentoD();
                    for (let i = 0; i < camiaoAutomatico.n; i++) {
                        await animacao();
                    }

                    camiaoAutomatico.i += 1;

                    setMovimentoE();
                    for (let i = 0; i < camiaoAutomatico.n; i++) {
                        await animacao();
                    }

                    setMovimentoF();
                    for (let i = 0; i < camiaoAutomatico.n; i++) {
                        await animacao();
                    }

                    checkEnd();

                    function checkEnd() {
                        console.log("checkEnd verification: " + camiaoAutomatico.percurso.length);
                        console.log("checkEnd verification: " + camiaoAutomatico.i);
                        if (camiaoAutomatico.i == camiaoAutomatico.percurso.length - 1) {
                            camiaoAutomatico.update = false;
                        }
                    }

                    async function animacao() {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        camiaoAutomatico.direcaoN = camiaoAutomatico.direcao + camiaoAutomatico.vela;

                        //console.log("pos inicial x: " + camiaoAutomatico.position.x);
                        console.log("pos inicial y: " + camiaoAutomatico.position.y);
                        //console.log("pos inicial z: " + camiaoAutomatico.position.z);

                        camiaoAutomatico.xN = camiaoAutomatico.position.x + camiaoAutomatico.velh * Math.cos(camiaoAutomatico.direcao); //diz this.direcao no tutorial mas pessoalmente acredito q possa ser this.direcaoN
                        camiaoAutomatico.yN = camiaoAutomatico.position.y + camiaoAutomatico.velv;
                        camiaoAutomatico.zN = camiaoAutomatico.position.z + camiaoAutomatico.velh * Math.sin(camiaoAutomatico.direcao); //diz this.direcao no tutorial mas pessoalmente acredito q possa ser this.direcaoN

                        //console.log("pos final x: " + camiaoAutomatico.xN);
                        console.log("pos final y: " + camiaoAutomatico.yN);
                        //console.log("pos final z: " + camiaoAutomatico.xN);
                        camiaoAutomatico.rotateY(camiaoAutomatico.direcao - camiaoAutomatico.direcaoN);
                        camiaoAutomatico.direcao = camiaoAutomatico.direcaoN;
                        camiaoAutomatico.position.set(camiaoAutomatico.xN, camiaoAutomatico.yN, camiaoAutomatico.zN);
                    }

                    //this.i = rotunda onde ele vai andar
                    function setMovimentoA() { //percorrer a rotunda
                        console.log("i " + camiaoAutomatico.i);
                        camiaoAutomatico.nI = camiaoAutomatico.percurso[camiaoAutomatico.i - 2];
                        camiaoAutomatico.ponteIJ = camiaoAutomatico.percurso[camiaoAutomatico.i - 1];
                        camiaoAutomatico.nJ = camiaoAutomatico.percurso[camiaoAutomatico.i];
                        camiaoAutomatico.ponteJK = camiaoAutomatico.percurso[camiaoAutomatico.i + 1];
                        camiaoAutomatico.nK = camiaoAutomatico.percurso[camiaoAutomatico.i + 2];
                        camiaoAutomatico.velA = 0.5; //ainda por ver

                        let rotacaoJK;
                        for (let j = 0; j < camiaoAutomatico.nJ.bases.length; j++) {
                            if (camiaoAutomatico.nJ.bases[j].armazemDestino == camiaoAutomatico.nK.idArmazem) {
                                rotacaoJK = camiaoAutomatico.nJ.bases[j].rotacao;
                                break;
                            }
                        }

                        /*let rotacaoJI;
                        for (let j = 0; j < camiaoAutomatico.nJ.bases.length; j++) {
                            if (camiaoAutomatico.nJ.bases[j].armazemDestino == camiaoAutomatico.nI.idArmazem) {
                                rotacaoJI = camiaoAutomatico.nJ.bases[j].rotacao;
                                break;
                            }
                        }*/

                        let rotacaoIJ;
                        for (let j = 0; j < camiaoAutomatico.nI.bases.length; j++) {
                            if (camiaoAutomatico.nI.bases[j].armazemDestino == camiaoAutomatico.nJ.idArmazem) {
                                rotacaoIJ = camiaoAutomatico.nI.bases[j].rotacao;
                                break;
                            }
                        }

                        //camiaoAutomatico.phi = rotacaoJK - rotacaoJI - ((Math.PI / 2) - camiaoAutomatico.teta) - ((Math.PI / 2) - camiaoAutomatico.teta);
                        camiaoAutomatico.phi = rotacaoJK - rotacaoIJ + camiaoAutomatico.teta + camiaoAutomatico.teta;
                        console.log("phi " + camiaoAutomatico.phi);
                        while (camiaoAutomatico.phi <= 0) {
                            camiaoAutomatico.phi += 2 * Math.PI;
                        }

                        while (camiaoAutomatico.phi >= Math.PI * 2) {
                            camiaoAutomatico.phi -= 2 * Math.PI;
                        }
                        console.log("phi " + camiaoAutomatico.phi);

                        camiaoAutomatico.cIJK = (camiaoAutomatico.rotundaRaio - camiaoAutomatico.b) * camiaoAutomatico.phi;

                        camiaoAutomatico.n = Math.ceil(camiaoAutomatico.cIJK / camiaoAutomatico.velA);
                        camiaoAutomatico.vela = camiaoAutomatico.phi / camiaoAutomatico.n;
                        camiaoAutomatico.velh = 2 * (camiaoAutomatico.rotundaRaio - camiaoAutomatico.b) * Math.sin(camiaoAutomatico.phi / camiaoAutomatico.n / 2);
                        camiaoAutomatico.velv = 0;
                    }

                    //this.i = rotunda onde ele vai estar
                    function setMovimentoB() { //saida na rotunda
                        //this.nJ = this.percurso[this.i];
                        //this.nK = this.percurso[this.i + 2];
                        camiaoAutomatico.velB = 0.15; //ainda por ver
                        camiaoAutomatico.cIJ = camiaoAutomatico.RAIO_ROTACAO * camiaoAutomatico.teta;
                        camiaoAutomatico.n = Math.ceil(camiaoAutomatico.cIJ / camiaoAutomatico.velB);
                        camiaoAutomatico.vela = -camiaoAutomatico.teta / camiaoAutomatico.n + 0.31;
                        camiaoAutomatico.velh = 2 * camiaoAutomatico.RAIO_ROTACAO * Math.sin(camiaoAutomatico.teta / camiaoAutomatico.n / 2);
                        camiaoAutomatico.velv = 0;
                    }

                    //this.i = rotunda de onde ele esta a sair
                    function setMovimentoC() { //base de saida
                        //this.nJ = this.percurso[this.i];
                        //this.nK = this.percurso[this.i + 2];
                        camiaoAutomatico.velC = 0.4; //ainda por ver
                        camiaoAutomatico.n = Math.ceil(camiaoAutomatico.lIJ / camiaoAutomatico.velC);
                        camiaoAutomatico.vela = 0;
                        camiaoAutomatico.velh = camiaoAutomatico.lIJ * camiaoAutomatico.n;
                        camiaoAutomatico.velv = 0;
                    }

                    //this.i = rampa onde esta
                    function setMovimentoD() { //rampa
                        //this.nI = this.percurso[this.i - 1];
                        //this.nJ = this.percurso[this.i + 1];
                        camiaoAutomatico.velD = 0.4;  //ainda por ver
                        camiaoAutomatico.n = Math.ceil(camiaoAutomatico.percurso[camiaoAutomatico.i].size / camiaoAutomatico.velD);
                        camiaoAutomatico.vela = 0;
                        let pIJ = camiaoAutomatico.percurso[camiaoAutomatico.i].size * Math.cos(camiaoAutomatico.percurso[camiaoAutomatico.i].rotationVertical);
                        camiaoAutomatico.velh = pIJ / camiaoAutomatico.n;
                        camiaoAutomatico.velv = -camiaoAutomatico.percurso[camiaoAutomatico.i].rotationVertical / camiaoAutomatico.n + 0.012;
                        camiaoAutomatico.rotateZ(-camiaoAutomatico.percurso[camiaoAutomatico.i].rotationVertical);
                        console.log("velv " + camiaoAutomatico.velv);
                    }

                    //this.i = rotunda onde esta a entrar
                    function setMovimentoE() { //base de entrada
                        //this.nI = this.percurso[this.i - 2];
                        //this.nJ = this.percurso[this.i];
                        camiaoAutomatico.velE = 0.4;  //ainda por ver
                        camiaoAutomatico.n = Math.ceil(camiaoAutomatico.lIJ / camiaoAutomatico.velE);
                        camiaoAutomatico.vela = 0;
                        camiaoAutomatico.velh = camiaoAutomatico.lIJ / camiaoAutomatico.n;
                        camiaoAutomatico.velv = 0;
                    }

                    //this.i = rotunda onde ele esta a entrar
                    function setMovimentoF() { //entrada na rotunda
                        //this.nI = this.percurso[this.i - 2];
                        //this.nJ = this.percurso[this.i];
                        camiaoAutomatico.velF = 0.15; //ainda por ver
                        camiaoAutomatico.cIJ = camiaoAutomatico.RAIO_ROTACAO * camiaoAutomatico.teta;
                        camiaoAutomatico.n = Math.ceil(camiaoAutomatico.cIJ / camiaoAutomatico.velF);
                        camiaoAutomatico.vela = -camiaoAutomatico.teta / camiaoAutomatico.n;
                        camiaoAutomatico.velh = 2 * camiaoAutomatico.RAIO_ROTACAO * Math.sin(camiaoAutomatico.teta / camiaoAutomatico.n / 2);
                        camiaoAutomatico.velv = 0;
                    }
                }
            }

        }
    }

}