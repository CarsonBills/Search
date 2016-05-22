var Config = require('modules/Config'),
    contentToFilter = require('views/ContentView.js'),
    searchHelper = require("modules/search_helper"),
    template = require('modules/navTemplate.hbs'),
    NavView = (function () {
        'use strict';
        var $el,
            refinements,
            CONTEXT = 'availableNavigation',

            initialize = function (options) {
                $el = $(options.el);
                initrender();
                filterView();
                collapseCategory();
                filterCheckBox();
                populateSubCategories();
                configureNavDisplay();
                resetNav();
            },

            updatePage = function(data){
                populateSubCategories(data["selectedNavigation"]);
                filterView();
                configureNavDisplay();
                collapseCategory();
                filterCheckBox();
                resetNav();
            },

            filterView = function(){
                $el.find('h3.category-text').click(function (e) {
                    var target = $(e.currentTarget);
                    window.location.hash += target.context.innerText.replace(/ /g, '%20');
                        var data = Config.get(CONTEXT);
                        for (var i = 0; i < data.length; i ++){
                            if (data[i]['displayName'] === target.context.innerText) {
                                populateSubCategories(data[i]['refinements']);
                            }
                        }
                        if ($('.breadcrumbs').text() === ""){
                            $('.breadcrumbs').append('<div class="breadcrumb"><h2>' + target.context.innerText + '</h2>&nbsp<p class="crumb_x">x</p><p class="crumb">></p></div>').show();
                        } else {
                            $(".crumb_x").hide();
                            $(".crumb").css("display", "inline-block");
                            $('.breadcrumbs').append('<div class="breadcrumb">&nbsp<h2>' + target.context.innerText + '</h2>&nbsp<p class="crumb">></p></div>').show();
                            
                        }
                    return false;
                });
            },

            populateSubCategories = function(data){
            
                $el.find('h3.category-text').click(function (e) {
                    refinements = searchHelper.getRefinements(data, e)
                    $.ajax({
                        url: '//dev2-services.wwnorton.com/search/search.php',
                        method: 'POST',
                        data: {
                            'clientKey': '8fd00c47-8378-455c-a1bc-e4f1f1704b87',
                            'collection': 'dummyDevelopment',
                            'area': 'dummyDevelopment',
                            'query': '',
                            'fields': ['*'],
                            'sort': {
                            'field': 'title',
                            'order': 'Ascending'
                            },
                            'refinements': refinements,
                            'pruneRefinements': false,
                            'skip': 0,
                            'pageSize': 10
                            },
                        success: function(data){

                            if ($(e.currentTarget).closest(".filters_checkboxes").siblings(".category_level").text().includes("categories") || $(e.currentTarget).parent().hasClass("breadcrumb")){
                                //update Nav
                                rerender(JSON.parse(data).data)
                            }  
                            // update Content                   
                            contentToFilter.showFiltered(JSON.parse(data).data);
                            clickBreadcrumb(refinements)
                        }
                    });
                })
            },

            clickBreadcrumb = function (refinements){
                $(".breadcrumb h2").click(function(e){
                    var index;
                    refinements = JSON.parse(refinements);
                    for (var f = 0; f < refinements.length; f++){
                        console.log(refinements[f]['value'] === $(e.currentTarget).text())
                        if (refinements[f]['value'] === $(e.currentTarget).text()){
                            console.log(":)")
                            index = f + 1;
                        }
                    }
                    refinements.splice(index, refinements.length)
                    populateSubCategories(refinements)
                })
            },

            configureNavDisplay = function(){
                $(".chevron").each(function(){
                    if ($(this).parent().hasClass("variants.volume") ||
                        $(this).parent().hasClass("edition_text") ||
                        $(this).parent().hasClass("series")) {
                        $(this).find('.fa-chevron-down').css("display", "none");
                        $(this).find('.fa-chevron-right').css("display", "inline");
                        $(this).siblings(".filters_checkboxes").hide();
                    } else {
                        $(this).find('.fa-chevron-right').css("display", "none");
                        $(this).find(".fa-chevron-down").css("display", "inline");
                    }
                })
            },

            collapseCategory = function(){
                $el.find('.chevron').click(function (e) {

                    //hide content on click
                    $(e.currentTarget).siblings('.filters_checkboxes').toggleClass("collapsed").slideToggle("fast");       
                    //change chevron
                    var current = $(e.currentTarget).find("i:visible");
                    $(e.currentTarget).find('i:hidden').show();
                    current.hide();
                });
            },

            initCategories = function(data){
                var categories = [];
                for (var b = 0; b < data.length; b++){
                    if (data[b]['name'] === 'categories.categories.value'){
                        categories = (data[b])
                    }
                }
                return  categories
            },

            initFilters = function(data){
                var filters = [];
                for (var b = 0; b < data.length; b++){
                    if (data[b]['name'] === "variants.product_form" || data[b]['name'] === "new_release"){
                        for (var x = 0; x < data[b]['refinements'].length; x++ ){
                            if (data[b]['refinements'][x]['value'] === ""){
                                data[b]['refinements'].splice(x, 1);
                            } 
                        } 
                        filters.push(data[b])
                    }
                }
                return filters
            },

            filterCheckBox = function(data){
                $el.find(".filter-text").click(function(e){
                    var gah = $(e.currentTarget).parent().find("input.filter-checkbox");
                    gah.prop("checked", !gah[0].checked)
                })
            },

            resetNav = function(){
                $('.search_container').on("clearBreadcrumbs", function(){
                    
                    initrender();
                })
            },

            reFilter = function(data){
                var filters = [];
                for (var b = 0; b < data.length; b++){

                    if (data[b]['name'] === "variants.product_form" ||
                    data[b]['name'] === "new_release" ||
                    data[b]['name'] === "variants.volume" ||
                    data[b]['name'] === "edition_text" ||
                    data[b]['name'] === "series" ){
                        for (var x = 0; x < data[b]['refinements'].length; x++ ){
                            if (data[b]['refinements'][x]['value'] === ""){
                                data[b]['refinements'].splice(x, 1);
                            } 
                        }
                        if (data[b]['refinements'].length !== 0){
                            filters.push(data[b])
                        }
                    } 
                }
                return filters
            },

            getResources = function(data){
                var resources = [];
                for (var b = 0; b < data.length; b++){

                    if (data[b]['name'] === "reading_guides"){
                        for (var x = 0; x < data[b]['refinements'].length; x++ ){
                            if (data[b]['refinements'][x]['value'] === "0"){
                                data[b]['refinements'].splice(x, 1);
                            } 
                        }
                        if (data[b]['refinements'].length !== 0){
                            resources.push(data[b])
                        }
                        
                    } 
                }
                return resources
            },

            rerender = function(data){
                if ($(".category_level").text() !== data.availableNavigation[0]['name'] && data.availableNavigation[0]['name'] !== "categories.categories.value"){
                    $el.empty().append(template({
                        categories: data.availableNavigation[0],
                        filters: reFilter(data.availableNavigation),
                        resources: getResources(data.availableNavigation)
                    }));
                } else {
                    $el.empty().append(template({
                        categories: "",
                        filters: reFilter(data.availableNavigation)
                    }));
                    $('.categories').empty();
                }

                updatePage(data);
            },

            initrender = function () {
                var context = Config.get(CONTEXT);
                $el.empty();
                $el.append(template({
                    categories: initCategories(context),
                    filters: initFilters(context),
                }));
            };

        return {
            initialize: initialize,
        };

    }());

module.exports = NavView;