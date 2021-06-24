import _ from 'lodash'
import * as $ from 'jquery';
import { io, Socket } from 'socket.io-client';
const Cookies = require('js-cookie');
const md5 = require("md5");

function logupUser() {
    let name = $("#input_name").val();
    let password = md5($("#input_password").val());

    if (!(name == null) && !(password == null) && !(name == undefined) && !(password == undefined) && name.length > 0 && password.length > 0) {
        fetch('/signup', {
            method: 'POST',
            body: JSON.stringify({ name: name, password: password }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Response status is: ${response.status}`);
                }
                return response.text();
            })
            .then(text => {
                if (text == "true") {
                    location.href = "room.html";
                    Cookies.set('userName', name);
                    Cookies.set('userPassword', password);
                }
                else
                    alert("Failed to register user");
            });
    }
    else
        alert("Input user data to logup");
}

function loginUser() {
    let name = $("#input_name").val();
    let password = md5($("#input_password").val());
    let isOkName = true, isOkPassword = true;

    alert("In login function");

    if (name == null || name == undefined || name.length == 0) {
        name = Cookies.get('userName');
        if (name == null || name == undefined)
            isOkName = false;
    }
    if (password == null || password == undefined || password.length == 0) {
        password = Cookies.get('userPassword');
        if (password == null || password == undefined)
            isOkPassword = false;
    }

    if (!isOkName || !isOkPassword)
        alert("Input user data to login");
    else {
        Cookies.set("userName", name);
        Cookies.set("userPassword", password);
        fetch('/login', {
            method: 'POST',
            body: JSON.stringify({ name: name, password: password })
        })
            .then(response => {
                console.log(responce);

                if (!response.ok) {
                    throw new Error(`Response status is: ${response.status}`);
                }
                return response.text();
            })
            .then(text => {
                console.log(text);

                if (text == "true") {
                    alert("You try to connect to the room");
                    location.href = "./room.html";
                }
                else
                    alert("Failed to login user");
            });
    }
}

let roomId = null;

function logupRoom() {
    roomId = 0;

    fetch('/create_room', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Response status is: ${response.status}`);
            }
            return response.text();
        })
        .then(text => {
            let tmpRoomId = text;

            if (tmpRoomId == null || tmpRoomId == undefined || tmpRoomId.length == 0)
                alert("Error in room logup");
            else {
                roomId = tmpRoomId;
                roomSession();
            }
        });
}

function loginRoom() {
    let tmpRoomId = $("#input_room_id").val();

    if (tmpRoomId == null || tmpRoomId == undefined || tmpRoomId.length == 0)
        alert("Input room data to log in room");
    else {
        roomId = tmpRoomId;
        roomSession();
    }
}

function roomSession() {
    alert(roomId);
    if (roomId == null || roomId == undefined || roomId.length == 0) {
        alert("Error in room connection (wrong id)");
        return;
    }
    if (!Cookies.get('userName')) {
        alert("You need to login before room connecting");
        return;
    }
    Cookies.set("roomId", roomId);
    location.href = "game.html";
}

function onLoad() {
    $("#user_logup_button").on("click", () => { logupUser(); });
    $("#user_login_button").on("click", () => { loginUser(); });
    $("#room_logup_button").on("click", () => { logupRoom(); });
    $("#room_login_button").on("click", () => { loginRoom(); });
}

$(onLoad)