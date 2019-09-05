let rawlog = '';

function readSingleFile(e) {
    if (!e.target.files) {
        return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (loaded) {
        rawlog = loaded.target.result;
        render();
    };
    reader.readAsText(file);
}

function render() {
    let startTime;
    let logTime;
    let indent = 0;
    const separateTests = $("#separate-tests").is(':checked');
    const lines = rawlog.split('\n').map(line => {
        const timestamp = line.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d,\d\d\dZ/);
        if (timestamp) {
            logTime = Date.parse(timestamp[0].replace(',', '.'));
            startTime = startTime || logTime;
        }
        let classes = ['logline'];
        let prefix = '';
        let postfix = '';
        if (line.startsWith('[INFO] Running ')) {
            classes.push('test-start');
            prefix = '<div class="test">';
            if (separateTests) {
                startTime = logTime;
            }
        }
        indent = (logTime - startTime) / 100;
        let isTestEnd = line.includes('] Tests run: ');
        if (isTestEnd) {
            classes.push('test-end');
            postfix = '</div>';
        }
        let result = `${prefix}<div style="padding-left: ${indent}px" class="${classes.join(' ')}">${line}</div>${postfix}`;
        if (isTestEnd && separateTests) {
            startTime = logTime;
        }
        return result;
    });
    $("#logCanvas").html(lines.join('\n'));
}

$("#file-input").change(function (e) {
    readSingleFile(e);
});

$("#text-size").change(function () {
    $('#logCanvas').css("font-size", $(this).val() + "px");
});

$("#separate-tests").change(function () {
    render();
});

$(document).on('mousemove', function (e) {
    $('#ruler').offset({ left: e.pageX - 5 });
});