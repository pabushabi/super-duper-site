'use strict';
let fish = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
let _s = $("*");
if (_s.is('#section') != null) { //adding articles
    (() => {
        if (document.documentElement.clientHeight > 760)
            $('#section').css("margin", "0 34% 0 9.5%");
        for (let i = 0; i < 20; i++) {
            let article = $("<article class='art'></article>");
            let h2 = $('<h2></h2>');
            let p = $('<p class="text"></p>');
            let img = $('<img src="/assets/arrow.svg" alt="arrow" class="arrows">');
            if (document.documentElement.clientHeight > 760)
                img.css("top","-120px");
            article.attr("id", i);
            h2.attr("id", i);
            p.attr("id", i);
            h2.html('Заголовок');
            $('#section').append(article);
            article.append(h2);
            article.append(p);
            article.append(img);
            p.html(fish);
        }
    })();

    let article = document.getElementsByClassName("art"); //creating animation of opening & closing
    [].forEach.call(article, (el) => {
        el.addEventListener("click", (e) => {
            let art = $(".art");
            if (art.eq(e.target.id).css("height") === '220px') {
                art.eq(e.target.id).css({'height':'80px', 'border':'1px solid #BFBFBF'});
                $(".arrows").eq(e.target.id).css({'transition':'transform 0.4s', 'transform':'rotate(0deg)'});
            } else {
                art.eq(e.target.id).css({'height':'220px', 'border':'1px solid crimson'});
                $(".arrows").eq(e.target.id).css({'transition':'transform 0.4s', 'transform':'rotate(180deg)'});
            }
        });
    });
    if (document.documentElement.clientHeight > 760)
        $(".bar").eq(0).css("rigth", "20%");
}

if (_s.is("#alter") !== false){
    let alter = $("#alter");
    let pass_inp = document.getElementById('pass');
    $("#visible").click(() => {
        if ($("#pass").attr("type") === "password") {
            $("#pass").attr("type", "text");
            $("#visible").attr("src","/assets/invisible.svg");
        } else {
            $("#pass").attr("type", "password");
            $("#visible").attr("src","/assets/visible.svg");
        }
    });
    if (document.documentElement.clientHeight > 760) {
        alter.css("top","21%");
        alter.css("left","8%");
        $(".reg_form").eq(0).css("left","43%");
    }
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

        console.log(chechs);
        let req = JSON.stringify({search_req: inp, radio: rad, check: chechs});
        console.log(req);
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.addEventListener("load", () => {
            console.log(xhr.response);
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

    let profile = JSON.stringify({Name: name, Second: secondName, Birthdate: birthdate, Education: education, Experience: experience,
        Specialization: specialization, Phone: phone, Time: time_mode, Pay_b: pay_b, Pay_t: pay_t, About: about});
    console.log(profile);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/profile",true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(profile);
}

if (_s.is("#resume-form") !== false) {
    if (document.documentElement.clientHeight > 760){
        $(".form-res").eq(0).css("right", "24%");
        $(".prof-inf").eq(0).css("left", "24%");
    }

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "/profile", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    xhr.addEventListener("load", () => {
        let res = xhr.response;
        let parsed = JSON.parse(res);
        let {first_name, second_name, birthdate, education, experience, specialization, phone,
            time_mode, pay_b, pay_t, about} = parsed[0];                    //Это деструктуризация и она крута!
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
    });

}