'use strict';
let fish = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

if (document.getElementById('section') != null) { //if this element is exsisting
    (() => {
        let section = document.getElementById('section');
        if (document.documentElement.clientHeight > 760)
            section.style.margin = "0 34% 0 9.5%";
        for (let i = 0; i < 20; i++) {
            let article = document.createElement("article");
            let h2 = document.createElement('h2');
            let p = document.createElement('p');
            let img = document.createElement('img');
            img.className = "arrows";
            img.src = '/assets/arrow.svg';
            if (document.documentElement.clientHeight > 760)
                img.style.top = "-120px";
            article.className = "art";
            article.id = i;
            h2.id = i;
            p.id = i;
            h2.innerHTML = 'Заголовок';
            p.className = 'text';
            section.appendChild(article);
            article.appendChild(h2);
            article.appendChild(p);
            article.appendChild(img);
            p.innerHTML = fish;
        }
    })();

    let arrows = document.getElementsByClassName('arrows');
    let article = document.getElementsByClassName("art");
    [].forEach.call(article, (el) => {
        el.addEventListener("click", (e) => {
            if (article[e.target.id].style.height === 220 + 'px') {
                article[e.target.id].style.height = '80px';
                article[e.target.id].style.border = '1px solid #BFBFBF';
                arrows[e.target.id].style.transition = 'transform 0.4s';
                arrows[e.target.id].style.transform = 'rotate(0deg)'
            } else {
                article[e.target.id].style.height = '220px';
                article[e.target.id].style.border = '1px solid crimson';
                arrows[e.target.id].style.transition = 'transform 0.4s';
                arrows[e.target.id].style.transform = 'rotate(180deg)'
            }
        });
    });
    let bar = document.getElementsByClassName("search_bar");
    if (document.documentElement.clientHeight > 760)
        bar[0].style.right = "20%";

}

if (document.getElementById('visible') != null){
    let vis = document.getElementById('visible');
    let pass_inp = document.getElementById('pass');
    vis.addEventListener('click', () => {
        if (pass_inp.type === "password") {
            pass_inp.type = "text";
            vis.src = "/assets/invisible.svg";
        } else {
            pass_inp.type = "password";
            vis.src = "/assets/visible.svg";
        }
    });
}

if (document.getElementById('search_label') != null) {
    let search_form = document.getElementsByClassName('search_form');
    search_form[0].addEventListener('change', () => {
        let sform = document.forms["search"];
        let inp = sform.elements["search_req"].value;
        let rad = sform.elements["radio-type"].value;
        let ch = sform.elements["check_"].value;
        let req = JSON.stringify({search_req: inp, radio: rad, check: ch});
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
    let resume = document.forms["Resume"];
    let name = resume.elements["Name"].value;
    let secondName = resume.elements["SecondName"].value;
    let birthdate = resume.elements["Birthdate"].value;
    let education = resume.elements["Education"].value;
    let experience = resume.elements["Experience"].value;
    let specialization = resume.elements["Specialization"].value;
    let phone = resume.elements["Phone"].value;
    let time_mode = resume.elements["Time-mode"].value;
    let pay_b = resume.elements["Pay-b"].value;
    let pay_t = resume.elements["Pay-t"].value;
    let about = resume.elements["About"].value;

    let profile = JSON.stringify({Name: name, Second: secondName, Birthdate: birthdate, Education: education, Experience: experience,
        Specialization: specialization, Phone: phone, Time: time_mode, Pay_b: pay_b, Pay_t: pay_t, About: about});
    console.log(profile);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/profile",true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(profile);
}

if (document.getElementsByClassName("form-res")[0] != null) {
    let bar = document.getElementsByClassName("form-res");
    let foo = document.getElementsByClassName("prof-inf");
    if (document.documentElement.clientHeight > 760){
        bar[0].style.right = "24%";
        foo[0].style.left = "24%";
    }
}

if (document.getElementById("alter") != null) {
    if (document.documentElement.clientHeight > 760) {
        document.getElementById("alter").style.top = "21%";
        document.getElementById("alter").style.left = "8%";
        document.getElementsByClassName("reg_form")[0].style.left = "43%";
    }

}