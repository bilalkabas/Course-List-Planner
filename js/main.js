function $ (element) {return document.querySelector(element)}

function remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
}

let elementsArray = document.querySelectorAll('.sec');
elementsArray.forEach(function (elem) {
    elem.addEventListener("click", function () {
        toggleSections(this.innerHTML);
    });
});

let elementsArray2 = document.querySelectorAll('.hour');
elementsArray2.forEach(function (elem) {
    elem.addEventListener("click", function () {
        toggleHours(this.id);
    });
});

$('#btn-add').addEventListener('click', function () { saveToList()}, false);
$("#btn-create").addEventListener("click", function () {createTables()}, false);
$(".btn-close").addEventListener("click", function () { closeTimetable() }, false);

let section = '-';

function toggleSections (id) {
    let element = '#sec' + id;
    element = $(element);
    for (let i = 1; i <= 7; i++) {
        let sec = '#sec' + i;
        sec = $(sec);
        sec.style.background = 'transparent';
        sec.style.color = '#bbb';
    }
    if (section != id) {
        element.style.background = '#ddd';
        element.style.color = '#444';
        section = id;
    } else if (section == id) {
        section = "-";
    }
}

let hours = [];
let hours2 = [];

function toggleHours(elem) {
    let element = $('#' + elem)
    if (hours.includes(elem)) {
        remove(hours, elem);
        remove(hours2, element.getAttribute("data-day"));
        element.style.background = 'transparent';
        element.style.color = '#bbb';
    } else {
        element.style.background = '#ddd';
        element.style.color = '#444';
        hours.push(elem);
        hours2.push(element.getAttribute("data-day"));
    }
}

//Course object constructor
function Course(name) {
    this.name = name;
    this.section = {};
    this.addSection = function (name, section, hours, hours2) {
        let sectionName = name + ".0" + section;
        this.section[sectionName] = new Section(name, section, hours, hours2);
    }
}

//Section object constructor
function Section(name, section, hours, hours2) {
    this.name = name + ".0" + section;
    this.section = section;
    this.hours = hours;
    this.hours2 = hours2;
}

let courses = {};

function saveToList() {
    let course = $('#course-name').value.toUpperCase();
    if (newCourseValidator(course)) {
        loadList();
        //reset everything
        section = '-';
        hours = [];
        hours2 = [];
        $('#course-name').value = "";
        for (let i = 1; i <= 7; i++) {
            let sec = '#sec' + i;
            sec = $(sec);
            sec.style.background = 'transparent';
            sec.style.color = '#bbb';
        }
        elementsArray2.forEach(function (elem) {
            elem.style.background = 'transparent';
            elem.style.color = '#bbb';
        });
        $(".list").scrollTop = $(".list").scrollHeight;
        $('.new-course-name').focus();
    }
}

function newCourseValidator () {
    let course = $('#course-name').value.toUpperCase();
    let val = true;
    if (course == "") {
        val = false;
        fadeIn($(".dot-error"), "50px");
        $(".dot-error").innerHTML = "Course name cannot be empty !";
        setTimeout(function () { fadeOut($(".dot-error"))}, 2500);
    } else if (hours.length == 0) {
        val = false;
        fadeIn($(".dot-error"), "50px");
        $(".dot-error").innerHTML = "Days & Hours cannot be empty !";
        setTimeout(function () { fadeOut($(".dot-error")) }, 2500);
    } else if (course.indexOf('.') != -1) {
        val = false;
        fadeIn($(".dot-error"), "50px");
        $(".dot-error").innerHTML = "Course name cannot contain dot !";
        setTimeout(function () { fadeOut($(".dot-error")) }, 2500);
    } else if (course.length > 8) {
        val = false;
        fadeIn($(".dot-error"), "50px");
        $(".dot-error").innerHTML = "Course name is too long !";
        setTimeout(function () { fadeOut($(".dot-error")) }, 2500);
    }

    if (val == true) {
        if (courses[course]) {

            if (courses[course].section[course + ".0-"]) {
                fadeIn($(".dot-error"), "50px");
                $(".dot-error").innerHTML = "This course cannot have any section !";
                setTimeout(function () { fadeOut($(".dot-error")) }, 2500);
                val = false;
            } else {
                if (section == "-") {
                    fadeIn($(".dot-error"), "50px");
                    $(".dot-error").innerHTML = "Section cannot be empty for this course !";
                    setTimeout(function () { fadeOut($(".dot-error")) }, 2500);
                    val = false;
                } else {
                    let sectionName = course + ".0" + section;
                    if (courses[course].section[sectionName]) {
                        fadeIn($(".dot-error"), "50px");
                        $(".dot-error").innerHTML = "Same section already exists !";
                        setTimeout(function () { fadeOut($(".dot-error")) }, 2500);
                        val = false;
                    } else {
                        courses[course].addSection(course, section, hours, hours2);
                    }
                }
            }
        } else {
            if (section == "-") {
                courses[course] = new Course(course);
                courses[course].addSection(course, section, hours, hours2);
                courses[course].section[course + ".0" + section].name = course;
            } else {
                courses[course] = new Course(course);
                courses[course].addSection(course, section, hours, hours2);
            }
        }
    }
    return val;
}

function fadeIn (elem, height) {
    elem.style.height = height;
    elem.style.opacity = "1";
}

function fadeOut (elem) {
    elem.style.height = "0";
    elem.style.opacity = "0";
}

function loadList () {
    $(".list").innerHTML = "";
    let sectionNames = getCourseNames();

    for (let i = 0; i < sectionNames.length; i++) {
        for (let j = 0; j < sectionNames[i].length; j++) {
            let section = sectionNames[i][j];
            let courseName = getCourseName(section);
            course = courses[courseName].name;
            let hours2 = courses[courseName].section[section].hours2;
            section = courses[courseName].section[section].section;

            let listCont = document.createElement('div');
            listCont.className = "list-container";
            $('.list').appendChild(listCont);

            let listItem = document.createElement('div');
            listItem.className = "list-item";
            listCont.appendChild(listItem);

            let listCourse = document.createElement('div');
            listCourse.className = "list-course-name";
            listCourse.innerHTML = course;
            listItem.appendChild(listCourse);

            let line1 = document.createElement('div');
            line1.className = "line2";
            listItem.appendChild(line1);

            let listSec = document.createElement('div');
            listSec.className = "list-section";
            listSec.innerHTML = section;
            listItem.appendChild(listSec);

            let line2 = document.createElement('div');
            line2.className = "line2";
            listItem.appendChild(line2);

            let listHours = document.createElement('div');
            listHours.className = "list-hours small-font";
            listHours.innerHTML = hours2.join("・");
            listItem.appendChild(listHours);

            let deleteBtn = document.createElement('div');
            deleteBtn.className = "btn-delete";
            deleteBtn.id = sectionNames[i][j];
            deleteBtn.innerHTML = '<div class="bd1"></div><div class="bd2"></div>';
            deleteBtn.addEventListener("click", function () {
                removeSection(this.id);
                loadList();
            }, false);
            listCont.appendChild(deleteBtn);
        }
    }
}

function closeTimetable () {
    $(".timetable-container").style.opacity = "0";
    $(".main-container").style.height = "100vh";
    $(".main-container").style.opacity = "1";
    $(".shade").style.opacity = "1";
}

const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

function getCourseNames() {
    let courseNames = [];
    let keys = Object.keys(courses);
    for (let i = 0; i < keys.length; i++) {
        courseNames[i] = [];
        courseNames[i] = (Object.keys(courses[keys[i]].section));
    }
    return courseNames;
}

function getHours() {
    let courseHours = [];
    let keys = Object.keys(courses);
    for (let i = 0; i < keys.length; i++) {
        courseHours[i] = [];
        let keys2 = Object.keys(courses[keys[i]].section);
        for (let j = 0; j < keys2.length; j++) {
            courseHours[i][j] = [];
            courseHours[i][j] = courses[keys[i]].section[keys2[j]].hours;
        }
    }
    return courseHours;
}

function isImproper(array) {
    let isImproper = false;
    for (let i = 0; i < array.length; i++) {
        let excluded = array.splice(i, 1);
        if (array.includes(excluded[0]))
            isImproper = true;
        array.splice(i, 0, excluded[0]);
    }
    return isImproper;
}

function createTimetable() {
    $(".main-container").style.height = "0";
    $(".main-container").style.opacity = "0";
    $(".timetable-container").style.height = "100vh";
    $(".timetable-container").style.opacity = "1";
    $(".shade").style.opacity = ".8";

    let nameComb = (cartesian(...getCourseNames()));
    let hourComb = (cartesian(...getHours()));
    let improperHour = [];
    let counter = 0;

    for (let i = 0; i < hourComb.length; i++) {

        if (isImproper(hourComb[i])) {
            nameComb.splice(i - counter, 1);
            counter++;
        }
    }

    let timetable = [];
    for (let i = 0; i < nameComb.length; i++) {
        timetable[i] = [];
        for (let j = 0; j <= 65; j++) {
            timetable[i].push("-");
        }
    }        

    for (let i = 0; i < nameComb.length; i++) {
        for (let j = 0; j < nameComb[i].length; j++) {
            let section = nameComb[i][j];
            let courseName = section.slice(0, section.indexOf("."));
            section = courses[courseName].section[section];

            for (let k = 0; k < section.hours.length; k++) {
                timetable[i][section.hours[k].substring(1)] = section.name;
            }
        }
    }
    return timetable;
    
}

function createTables () {
    if (Object.keys(courses).length > 1) {
        let timetable = createTimetable();
        if (timetable.length > 0) {
            if (timetable.length > 1) {
                $(".table-count").innerHTML = "Total " + timetable.length + " timetables created !";
            } else {
                $(".table-count").innerHTML = "Total " + timetable.length + " timetable created !";
            }
            $('.timetables').innerHTML = "";
            for (let i = 0; i < timetable.length; i++) {
                let table = document.createElement('div');
                table.className = "timetable-table";
                $('.timetables').appendChild(table);

                table.innerHTML = '<div class="table-days"><div class="table-space"><div>' + (i + 1) + '</div></div><div>Monday</div><div>Tuesday</div><div>Wednesday</div><div>Thursday</div><div>Friday</div></div>';

                let items = document.createElement('div');
                items.className = "timetable-items";
                table.appendChild(items);

                items.innerHTML = '<div class="timetable-entry timetable-hours"><div>Period 1<br>08:00</div><div>Period 2<br>09:00</div><div>Period 3<br>10:00</div><div>Period 4<br>11:00</div><div>Period 5<br>12:00</div><div>Period 6<br>13:00</div><div>Period 7<br>14:00</div><div>Period 8<br>15:00</div><div>Period 9<br>16:00</div><div>Period 10<br>17:00</div><div>Period 11<br>18:00</div><div>Period 12<br>19:00</div><div>Period 13<br>20:00</div></div >';

                for (let j = 1; j <= 5; j++) {
                    let day = document.createElement('div');
                    day.className = "timetable-entry timetable-day";
                    items.appendChild(day);

                    for (let k = 1; k <= 13; k++) {
                        let period = document.createElement('div');
                        day.appendChild(period);
                        period.innerHTML = timetable[i][(j - 1) * 13 + k];

                        if ( k != 13)
                            day.innerHTML += '<div class="line2 table-line"></div>';
                    }
                }
            }
        } 
    } else {
        fadeIn($(".dot-error"), "50px");
        $(".dot-error").innerHTML = "At least two courses are required !";
        setTimeout(function () { fadeOut($(".dot-error")) }, 2500);
    }
}

function removeSection (sec) {
    let courseName = sec.slice(0, sec.indexOf("."));
    let sectionCount = Object.keys(courses[courseName].section).length;
    if (sectionCount > 1) {
        delete courses[courseName].section[sec];
    } else {
        delete courses[courseName];
    }
}

function getCourseName (sec) {
    let name = sec.slice(0, sec.indexOf("."));
    return name;
}