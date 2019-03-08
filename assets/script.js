'use strict';
let fish = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

if ($('#section') != null) { //adding articles
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

if ($("#alter") != null){
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

if ($('#search_label') != null) {
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

if ($(".form-res").eq(0) != null) {
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
        // let parsed = JSON.parse(res);
        console.log(res);
        // console.log(parsed[0]);

        // console.log(parsed.split(","));
        // $("#i-name").val(parsed[0]);
        // $("#i-secname").val();
        // $("#i-date").val();
        // $("#i-ed").prop("checked");
        // $("#i-ex").val();
        // $("#select-spec").val();
        // $("#i-tel").val();
        // $("#time-mode").val();
        // $("#i-payb").val();
        // $("#i-payt").val();
        // $("#i-about").val();
    });

    let resume = document.forms["Resume"];
    let name = resume.elements["Name"];
    let secondName = resume.elements["SecondName"];
    let birthdate = resume.elements["Birthdate"];
    let education = resume.elements["Education"];
    let experience = resume.elements["Experience"];
    let specialization = resume.elements["Specialization"];
    let phone = resume.elements["Phone"];
    let time_mode = resume.elements["Time-mode"];
    let pay_b = resume.elements["Pay-b"];
    let pay_t = resume.elements["Pay-t"];
    let about = resume.elements["About"];


}