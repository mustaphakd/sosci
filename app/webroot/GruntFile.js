/**
 * Created by Mustapha on 2/7/2015.
 */

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer-core')({browsers: 'last 1 version'}).postcss,
                    require('csswring').postcss
                ]
            },
            dist: {
                src: 'css/main.css'
            }
        },
        concat: {
            src_lbs: {
                src: ['js/libs/jquery-2.1.3.min.js', 'js/libs/verge.js', 'js/libs/sly.min.js','js/libs/plugins.js', 'js/libs/fileImporter.js'],
                dest: 'js/libs.js'
            },
            src_bottom_lbs: {
                src: [ 'js/libs/leaflet.label.js', 'js/libs/leaflet.heatmap.js', 'js/libs/animation.gsap.js'],
                dest: 'js/bottom_libs.js'
            },
            src_libs_min:{
                src:['js/libs_pre.min.js', 'js/libs/appframework.ui.js'],
                dest:'js/libs.min.js'
            },
            src_msnry_imgLoaded:{
                src:['js/libs/masonry.pre.pkgd.min.js', 'js/libs/imagesLoaded.pkgd.min.js'],
                dest:'js/libs/masonry.pkgd.min.js'
            },
            src_bottom_last_lib:{
                src:['js/bottom_libs.min.js', 'js/libs/index.min.js', 'js/motor/main.js'],
                dest:'js/bottom_libs_last.js'
            }
           /* ,
            extrn_stats_cntrlr_libs:{
                src:['js/bottom_libs.min.js', 'js/libs/index.min.js', 'js/motor/main.min.js'],
                dest:'js/bottom_libs_last.js'
            }*/
        },
        uglify : {
            options: {
                mangle: false,
                compress: true
            },
            libs_mv: {
                files: [
                    { 'js/libs_pre.min.js' : 'js/libs.js' },
                    {'js/bottom_libs.min.js' : 'js/bottom_libs.js' },
                    { 'js/motor/main.min.js' : 'js/motor/main.js' },

                    /* uglify controlles and services*/


                    { 'js/motor/controllers/addCaseController.min.js' : 'js/motor/controllers/addCaseController.js' },
                    {'js/motor/controllers/statsController.min.js' : 'js/motor/controllers/statsController.js' },
                    { 'js/motor/controllers/dashboardController.min.js' : 'js/motor/controllers/dashboardController.js' },
                    { 'js/motor/controllers/galleryController.min.js' : 'js/motor/controllers/galleryController.js' },
                    {'js/motor/controllers/homeController.min.js' : 'js/motor/controllers/homeController.js' },
                    { 'js/motor/controllers/rootController.min.js' : 'js/motor/controllers/rootController.js' },
                    { 'js/motor/services.min.js' : 'js/motor/services.js' }
                ]
            }
        }
    });


    grunt.registerTask('default', [
        'postcss:dist',
        'concat:src_lbs',
        'concat:src_bottom_lbs',
        'uglify:libs_mv',
        'concat:src_libs_min',
        'concat:src_msnry_imgLoaded',
        'concat:src_bottom_last_lib'
    ]);

};