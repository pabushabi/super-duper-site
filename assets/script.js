'use strict';
let fish = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
let _s = $("*");

if (_s.is('#section') != null) {
    if (document.documentElement.clientWidth > 1500){
        $('#section').css("margin", "0 34% 0 16.3%");
        $(".bar").eq(0).css("rigth", "20%");
    }


    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.addEventListener("load", () => {
        let par = JSON.parse(xhr.response);
        let {da1, da2} = par;
        console.log(da1);
        console.log(da2);
        // let parsed = JSON.parse(da1);
        console.log(da1[0], da2[0]);
        if (da1.length !== 0) {
            for (let i = 0; i < da1.length; i++)
            {
                let {
                    login, first_name, second_name, birthdate, education, experience, specialization, phone,
                    time_mode, pay_b, pay_t, about
                } = da1[i];
                let article = $("<article class='art'></article>");
                let h2 = $('<h2></h2>');
                let p = $('<p class="text"></p>');
                let img = $('<img src="/assets/arrow.svg" alt="arrow" class="arrows">');
                if (document.documentElement.clientHeight > 760)
                    img.css("top","-120px");
                article.attr("id", i);
                h2.attr("id", i);
                p.attr("id", i);
                img.attr("id", i);
                h2.html(`${first_name} ${second_name}, ${specialization}`);
                $('#section').append(article);
                article.append(h2);
                article.append(p);
                article.append(img);
                let t = birthdate.indexOf('-');
                let dateNow = new Date();
                let age = dateNow.getFullYear() - birthdate.substring(0, t);
                let educ = (education === "true") ? "Да" : "Нет";
                p.html(`${first_name} ${second_name}, <br> Специализация: <b>${specialization}</b>,
                <br> Возраст: ${age}, Опыт работы: <b>${experience}</b>,
                <br> Высшее образование: ${educ} 
                <br> Предпочитаемый режим работы: ${time_mode}, 
                <br> Желаемая заработная плата: <b>${pay_b}р - ${pay_t}р</b>.
                <br> Коротко о себе: ${about}`);
            }
        }
        if (da2.length !== 0) {
            for (let i = da1.length; i < da2.length + da1.length; i++)
            {
                let {
                    login, name, age, education, experience, specialization, phone,
                    time_mode, pay_b, pay_t, about
                } = da2[i - da1.length];
                let article = $("<article class='art'></article>");
                let h2 = $('<h2></h2>');
                let p = $('<p class="text"></p>');
                let img = $('<img src="/assets/arrow.svg" alt="arrow" class="arrows">');
                if (document.documentElement.clientHeight > 760)
                    img.css("top","-120px");
                article.attr("id", i);
                h2.attr("id", i);
                p.attr("id", i);
                img.attr("id", i);
                h2.html(`Вакансия ${specialization} в "${name}"`);
                $('#section').append(article);
                article.append(h2);
                article.append(p);
                article.append(img);
                let educ = (education === "true") ? "Да" : "Нет";
                p.html(`Организация "${name}" ищет людей, удовлетворяющих требованиям:
                <br> Специализация: <b>${specialization}</b>,
                <br> Возраст: ${age}, Опыт работы: <b>${experience}</b>, 
                <br> Высшее образование: ${educ}
                <br> Предпочитаемый режим работы: ${time_mode}, 
                <br> Предоставляемая заработная плата: <b>${pay_b}р - ${pay_t}р</b>.
                <br> Коротко о компании (дополнительные требования): ${about}`);
            }
        }
        createAnim();
    });
    let data = JSON.stringify({type: "articles"});
    xhr.send(data);
}

function createAnim() {
    let art = $(".art");
    let arrow = $(".arrows");
    art.click((e) => {
        if (art.eq(e.target.id).css("height") === '220px') {
            art.eq(e.target.id).css({'height':'32px', 'border-top':'1px solid rgba(27, 31, 35, 0.1)', 'background-color': '#fff',
                'border-image': 'none'});
            arrow.eq(e.target.id).css({'transition':'transform 0.4s', 'transform':'rotate(0deg)'});
        } else {
            art.eq(e.target.id).css("height", "220px");
            art.eq(e.target.id).css({'height':'220px', 'border-image':'linear-gradient(75deg, var(--mainColor), #6d78ff)',
                'background-color': 'rgba(0, 0, 0, .015)'});
            arrow.eq(e.target.id).css({'transition':'transform 0.4s', 'transform':'rotate(180deg)'});
        }
    })
}

if (_s.is("#visible") !== false){
    let pass = $("#pass");
    let visible = $("#visible");
    visible.click(() => {
        if (pass.attr("type") === "password") {
            pass.attr("type", "text");
            visible.attr("src","/assets/invisible.svg");
        } else {
            pass.attr("type", "password");
            visible.attr("src","/assets/visible.svg");
        }
    });
    if (document.documentElement.clientWidth > 1500)
        $(".reg_form").eq(0).css("left","43%");
}

if (_s.is('#search_label') !== false) {
    let search_form = $('.search_form');
    search_form.eq(0).on('change', () => {
        let sform = document.forms["search"];
        let inp = sform.elements["search_req"].value;
        let rad = sform.elements["radio-type"].value;

        let chechs = [];
        for (let i = 1; i < 5; i++)
            if (document.getElementById("c" + i).checked)
                chechs[i-1] = i;

        let req = JSON.stringify({type: "search", search_req: inp, radio: rad, check: chechs});
        console.log(req);
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.addEventListener("load", () => {
            // console.log(xhr.response);
        });
        xhr.send(req);
    })
}
function resume_submit() {
    let name = $("#i-name").val();
    let secondName = $("#i-secname").val();
    let birthdate = $("#i-date").val();
    let education = $("#i-ed").prop("checked");
    let experience = $("#i-ex").val();
    let specialization = $("#select-spec").val();
    let phone = $("#i-tel").val();
    let time_mode = $("#time-mode").val();
    let pay_b = $("#i-payb").val();
    let pay_t = $("#i-payt").val();
    let about = $("#i-about").val();

    if (name === "" || secondName === "" || birthdate === "" || experience === "" || phone === "" || time_mode === "" || pay_b === "" ||
        pay_t === "" || about === "") {
        $("#error").css("display", "block");
        return;
    }
    else { $("#error").css("display", "none") }


    let profile = JSON.stringify({
        type: "add", Name: name, Second: secondName, Birthdate: birthdate, Education: education, Experience: experience,
        Specialization: specialization, Phone: phone, Time: time_mode, Pay_b: pay_b, Pay_t: pay_t, About: about
    });
    console.log(profile);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/profile", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(profile);
    xhr.addEventListener("load", () => {
        let submit = $("#submit");
        submit.blur();
        submit.html("Сохранено!");

        setTimeout(() => {
            submit.html("Сохранить");
        }, 2000)
    });


}
function vac_submit() {
    let name = $("#v-name").val();
    let age = $("#v-date").val();
    let education = $("#v-ed").prop("checked");
    let experience = $("#v-ex").val();
    let specialization = $("#select-vac").val();
    let phone = $("#v-tel").val();
    let time_mode = $("#time").val();
    let pay_b = $("#v-payb").val();
    let pay_t = $("#v-payt").val();
    let about = $("#v-about").val();

    if (name === "" || age === "" || experience === "" || phone === "" || time_mode === "" || pay_b === "" ||
        pay_t === "" || about === "") {
        $("#error1").css("display", "block");
        return;
    }
    else { $("#error1").css("display", "none") }

    let profile = JSON.stringify({
        type: "add-vac", Name: name, Age: age, Education: education, Experience: experience,
        Specialization: specialization, Phone: phone, Time: time_mode, Pay_b: pay_b, Pay_t: pay_t, About: about
    });
    console.log(profile);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/profile", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(profile);
    xhr.addEventListener("load", () => {
        let submit = $("#submit1");
        submit.blur();
        submit.html("Сохранено!");

        setTimeout(() => {
            submit.html("Сохранить");
        }, 2000)
    });


}

function logout(){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/profile", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({type: "exit"}));
    xhr.addEventListener("load", () => {
        console.log(xhr.response);
        location.reload();
    })
}

if (_s.is(".resume-form") !== false) {
    $(".log").css("display", "none");

    if (document.documentElement.clientWidth > 1500){
        $(".form-res").eq(0).css("right", "24%");
        $(".prof-inf").eq(0).css("left", "24%");
    }
    let resF = true;
    $("#change").click(() => {
        if ($(".vac-form").css("display") === "none") {
            $("#change").html("Резюме");
            $(".vac-form").css("display", "block");
            $(".resume-form").css("display", "none");
            resF = false;
        }
        else {
            $("#change").html("Вакансия");
            $(".vac-form").css("display", "none");
            $(".resume-form").css("display", "block");
            resF = true;
        }
    });

    let pay = (b, t) => { b.change(() => {
        t.prop("min", b.val());
        if (t.val() * 1 < b.val() * 1)
            t.val(b.val())
    }) };
    pay($("#i-payb"), $("#i-payt"));
    pay($("#v-payb"), $("#v-payt"));

    let mth = new Date().getMonth() + 1;
    if ((new Date().getMonth() + 1) < 10)
        mth = "0" + mth;
    let date = (new Date().getFullYear() - 14) + "-" + mth + "-" + new Date().getDate();
    let dateOld = (new Date().getFullYear() - 110) + "-01-01";
    let birthday = $("#i-date");
    birthday.prop("max", date);
    birthday.prop("min", dateOld);

    // birthday.change(() => {
    //     if (birthday.val() > date)
    //
    // });

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/profile", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({type: "get"}));
    xhr.addEventListener("load", () => {
        let res = xhr.response;
        let parsed = JSON.parse(res);
        if (parsed.length !== 0) {
            let {
                first_name, second_name, birthdate, education, experience, specialization, phone,
                time_mode, pay_b, pay_t, about
            } = parsed[0];                    //Это деструктуризация и она крута!
            console.log(first_name, second_name, birthdate, education, experience, specialization,
                phone, time_mode, pay_b, pay_t, about);

            $("#i-name").val(first_name);
            $("#i-secname").val(second_name);
            $("#i-date").val(birthdate);
            if (education === 'true')
                $("#i-ed").prop("checked", 1);
            else $("#i-ed").prop("checked", 0);
            $("#i-ex").val(experience);
            $("#select-spec").val(specialization);
            $("#i-tel").val(phone);
            $("#time-mode").val(time_mode);
            $("#i-payb").val(pay_b);
            $("#i-payt").val(pay_t);
            $("#i-about").val(about);
        }
    });

    let xhrv = new XMLHttpRequest();
    xhrv.open("POST", "/profile", true);
    xhrv.setRequestHeader("Content-Type", "application/json");
    xhrv.send(JSON.stringify({type: "get-vac"}));
    xhrv.addEventListener("load", () => {
        let res = xhrv.response;
        let parsed = JSON.parse(res);
        if (parsed.length !== 0) {
            let {
                name, age, education, experience, specialization, phone,
                time_mode, pay_b, pay_t, about
            } = parsed[0];                    //Это деструктуризация и она крута!
            console.log(name, age, education, experience, specialization,
                phone, time_mode, pay_b, pay_t, about);

            $("#v-name").val(name);
            $("#v-date").val(age);
            if (education === 'true')
                $("#v-ed").prop("checked", 1);
            else $("#v-ed").prop("checked", 0);
            $("#v-ex").val(experience);
            $("#select-vac").val(specialization);
            $("#v-tel").val(phone);
            $("#time").val(time_mode);
            $("#v-payb").val(pay_b);
            $("#v-payt").val(pay_t);
            $("#v-about").val(about);
        }
    });

}