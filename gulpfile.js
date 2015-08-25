var gulp = require("gulp");
var gutil = require("gulp-util");
var karma = require("karma").server;
var lodash = require("lodash");
var path = require("path");
var uglify = require("gulp-uglify");

var argv = require("minimist")(process.argv.slice(2));

var PATHS = {
    LIVERELOAD: [
        "index.html",
        "src/**/*.js",
        "src/**/*.html"
    ]
};

//slide:start:karmaconfig;
var KARMA_CONFIG = {
    browsers: ["Chrome"],
    frameworks: ["jasmine"],
    files: [
        "node_modules/angular/angular.js",
        "node_modules/angular-mocks/angular-mocks.js",
        "node_modules/jquery/dist/jquery.js",
        "src/*/*.js",
        "src/*/*.tpl.html"
    ]
};
//slide:end:karmaconfig;

KARMA_CONFIG = lodash.assign(KARMA_CONFIG, {
    preprocessors: {
        "src/**/*.tpl.html": ["ng-html2js"]
    },
    ngHtml2JsPreprocessor: {
        cacheIdFromPath: function(filepath) {
            return path.basename(filepath);
        },
        moduleName: "templates"
    }
});

var KARMA_CONFIG_CI = lodash.assign({}, KARMA_CONFIG);
KARMA_CONFIG_CI.files = [
    "node_modules/angular/angular.js",
    "node_modules/angular-mocks/angular-mocks.js",
    "node_modules/jquery/dist/jquery.js",
    "src/**/*.js",
    "src/**/*.tpl.html"
];

gulp.task("livereload", function () {
    var livereload = require("gulp-livereload");

    livereload.listen({
        quiet: true
    });

    gulp.watch(PATHS.LIVERELOAD)
        .on("change", function(file) {
            livereload.changed(file.path);
            gutil.log(gutil.colors.yellow("Live Reload: ") + gutil.colors.magenta(file.path) + " reloaded.");
        });
});

gulp.task("play", ["livereload"], function() {

    var connect = require("connect");
    var http = require("http");
    var open = require("open");

    var serveStatic = require("serve-static");
    var serveIndex = require("serve-index");

    var port = 9001, app;

    app = connect()
        .use(serveStatic(__dirname))
        .use(serveIndex(__dirname));
    
    var fs = require('fs');
    
    var items = {
        primary: fs.readdirSync("img/inventory/primary/"),
        secondary: fs.readdirSync("img/inventory/secondary/"),
        armor: fs.readdirSync("img/inventory/armor/"),
        helm: fs.readdirSync("img/inventory/helm/"),
        accessory: fs.readdirSync("img/inventory/accessory/"),
    };
    
    var monsters = fs.readdirSync("img/monster/");

    var server = http.createServer(app).listen(port, function() {
        gutil.log("Local web server started at http://localhost:" + port);
//        open("http://localhost:" + port, "chrome");
    });
    
    var io = require('socket.io').listen(server);
    io.sockets.on('connection', function (socket) {
    	gutil.log("Client connected.");
    	
      socket.on('event', function (message) {
      	gutil.log("Broadcasting " + message);
      	socket.broadcast.emit(message.type, message);
      });
      
      socket.on('getItems', function (message) {
        socket.emit("itemList", items);
      });
      
      socket.on('getMonsters', function (message) {
        socket.emit("monsterList", monsters);
      });
    });
    
    
    server.listen(9001);
});

//slide:start:karma;
gulp.task("test", function (done) {
    karma.start(lodash.assign(KARMA_CONFIG, {
        singleRun: true
    }), done);
});

gulp.task("tdd", function (done) {
    karma.start(KARMA_CONFIG, done);
});
//slide:end:karma;

gulp.task("test/solution", function (done) {
    var singleRun = true;
    if (argv.tdd) {
        singleRun = false;
    }
    karma.start(lodash.assign(KARMA_CONFIG_CI, {
        singleRun: singleRun
    }), done);
});

//slide:start:tplcache;
gulp.task('build:tpls', function() {
    var ngTplCache = require("gulp-angular-templatecache");
    return gulp.src("src/**/solution/*.tpl.html")
        .pipe(ngTplCache({
            filename: "src/exercises.tpls.min.js",
            standalone: true
        }))
        .on("error", handleError)
        .pipe(uglify())
        .on("error", handleError)
        .pipe(gulp.dest("dist"));
});
//slide:end:tplcache;

//slide:start:packaging;
gulp.task('build:package', function() {
    var concat = require("gulp-concat");
    return gulp.src("src/**/*.js")
       .pipe(uglify())
       .on("error", handleError)
       .pipe(concat("app.min.js"))
       .pipe(gulp.dest("dest"));
});
//slide:end:packaging;

var breakOnError = true;
function handleError(ex) {
    var message = [
        gutil.colors.red("[" + ex.plugin + "] errored"),
        "\n\n",
        ex.message,
        "\n"
    ];
    if(ex.stack) {
        message = message.concat(["\n", ex.stack, "\n"]);
    }
    gutil.log.apply(gutil.log, message);

    if (breakOnError) {
        return process.exit(1);
    } else {
        gutil.beep();
        this.emit('end');
    }
}


gulp.task("default", ["play"]);
