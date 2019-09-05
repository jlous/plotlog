function readSingleFile(e) {
    if (!e.target.files) {
        return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (loaded) {
        render(loaded.target.result);
    };
    reader.readAsText(file);
}

function render(logfile) {
    let startTime;
    let indent = 0;
    const lines = logfile.split('\n').map(line => {
        const timestamp = line.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d,\d\d\dZ/);
        if (timestamp){
            const logTime = Date.parse(timestamp[0].replace(',','.'));
            startTime = startTime || logTime;
            indent = (logTime-startTime)/100;
        }
        let classes = ['logline'];
        let prefix = '';
        let postfix = '';
        if (line.startsWith('[INFO] Running ')){
            classes.push('test-start');
            prefix = '<div class="test">';
        }
        if (line.includes('] Tests run: ')){
            classes.push('test-end');
            postfix = '</div>';
        }
        return `${prefix}<div style="padding-left: ${indent}px" class="${classes.join(' ')}">${line}</div>${postfix}`;
    });
    $("#logCanvas").html(lines.join('\n'));
}

$("#file-input").change(function(e) {
    readSingleFile(e);
});

$("#text-size").change(function() {
    $('#logCanvas').css("font-size", $(this).val()+"px");
});

$(document).on('mousemove', function(e){
    $('#ruler').offset({left: e.pageX-5});
});