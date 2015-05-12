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
                src:['js/libs_pre.min.js', 'js/libs/appframework.ui.min.js'],
                dest:'js/libs.min.js'
            },
            src_msnry_imgLoaded:{
                src:['js/libs/masonry.pre.pkgd.min.js', 'js/libs/imagesLoaded.pkgd.min.js'],
                dest:'js/libs/masonry.pkgd.min.js'
            }
        },
        uglify : {
            options: {
                mangle: true,
                compress: true
            },
            libs_mv: {
                files: [
                    { 'js/libs_pre.min.js' : 'js/libs.js' },
                    {'js/bottom_libs.min.js' : 'js/bottom_libs.js' }
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
        'concat:src_msnry_imgLoaded'
    ]);

};