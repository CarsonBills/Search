var Config = require('modules/Config'),
    refinements,
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
                collapseCategory();
                filterCheckBox();
                clickCheckBox();
                setupNav();
                configureNavDisplay();
                resetNav();
                moreRecords();
            },

            updatePage = function(data){
                resetNav();
                configureNavDisplay();
                collapseCategory();
                moreRefinements(data["selectedNavigation"]);
                moreRecords(data["selectedNavigation"]);
            },

            setupNav = function(data){
                refinements = data;
                $el.find('h3.category-text').click(function (e) {
                    populateSubCategories(e);
                })
            },

            populateSubCategories = function(e){
                console.log("populateSubCategories Begin", e)
                var domRefinements = searchHelper.domRefinements(e);
                var searchQuery = searchHelper.getQuery();
                $.ajax({
                    url: '//dev2-services.wwnorton.com/search/search.php',
                    method: 'POST',
                    data: {
                        'collection': 'dummyDevelopment',
                        'area': 'dummyDevelopment',
                        'query': searchQuery,
                        'fields': ['*'],
                        'sort': {
                        'field': 'title',
                        'order': 'Ascending'
                        },
                        'refinements': domRefinements,
                        'pruneRefinements': false,
                        'skip': 0,
                        'pageSize': 25
                        },
                    success: function(data){

                        if ($(e.currentTarget).closest(".filters_checkboxes").siblings(".category_level").text().includes("categories") || $(e.currentTarget).parent().hasClass("breadcrumb")){
                            //update Nav
                            rerenderNav(JSON.parse(data).data)
                        }  else {
                            rerenderFilter(JSON.parse(data).data)
                        }
                        // update Content                 
                        contentToFilter.showFiltered(JSON.parse(data).data);
                        buildBreadcrumb(domRefinements)
                        moreRecords(JSON.parse(data).data);
                        checkboxState(domRefinements);
                        clickCheckBox();
                    }
                });
                console.log("populateSubCategories END", e)
            },

            moreRefinements = function(data){
                $el.find(".nav_show_more").click(function(e){
                    console.log("EXAMPLE", data, e)
                    refinements = searchHelper.domRefinements(data, e);
                    var searchQuery = searchHelper.getQuery();
                    $.ajax({
                        url: '//dev2-services.wwnorton.com/search/search.php?more_ref=1',
                        method: 'POST',
                        data: {
                            'collection': 'dummyDevelopment',
                            'area': 'dummyDevelopment',
                            'navigationName': $(e.currentTarget).parent().siblings(".category_level").text(),
                            'query': searchQuery,
                            'refinements': refinements,
                            },
                        success: function(data){
                            rerenderNav(JSON.parse(data).data)
                        }
                    });
                })
            },

            moreRecords = function(data){
                $(".show_more").click(function(e){
                    if (data && data.selectedNavigation && data.records){
                        refinements = searchHelper.domRefinements(data.selectedNavigation, e)
                    } else {
                        refinements = "";
                    }
                    var searchQuery = searchHelper.getQuery();
                    $.ajax({
                        url: '//dev2-services.wwnorton.com/search/search.php',
                        method: 'POST',
                        data: {
                            'collection': 'dummyDevelopment',
                            'area': 'dummyDevelopment',
                            'query': searchQuery,
                            'fields': ['*'],
                            'sort': {
                            'field': 'title',
                            'order': 'Ascending'
                            },
                            'refinements': refinements,
                            'pruneRefinements': false,
                            'skip': 0,
                            'pageSize': parseInt($(".current_results").text()) + 25
                            },
                        success: function(data){

                            if ($(e.currentTarget).closest(".filters_checkboxes").siblings(".category_level").text().includes("categories") || $(e.currentTarget).parent().hasClass("breadcrumb")){
                                //update Nav
                                rerenderNav(JSON.parse(data).data)
                            } 
                            // update Content                   
                            contentToFilter.showFiltered(JSON.parse(data).data);
                            buildBreadcrumb(refinements)
                            moreRecords(JSON.parse(data).data);
                        }
                    });
                });    
            },

            buildBreadcrumb = function (refinements){
                $('.breadcrumbs').empty()
                refinements = JSON.parse(refinements)
                console.log("buildBreadcrumb BEGIN", refinements)
                    var breadcrumbs = [];
                    for (var g = 0; g < refinements.length; g++){                
                        breadcrumbs.push({'name': refinements[g]['navigationName'], 'value' : refinements[g]['value']})
                    }
                    console.log(breadcrumbs)
                    for (var h = 0; h < breadcrumbs.length; h++){
                        $('.breadcrumbs').append('<div name='+breadcrumbs[h].name+" class='breadcrumb'>&nbsp<h2>" + breadcrumbs[h].value + "</h2>&nbsp<p class='crumb_x'>x</p><p class='crumb'>></p></div>"); 
                    }

                configureBreadcrumbs();
                xBreadcrumb();
                console.log("buildBreadcrumb END", refinements)
                clickBreadcrumb();
            },

            xBreadcrumb = function (data){
                $('p.crumb_x').click(function (){
                    $('.search_container').trigger('clearBreadcrumbs')
                    $('.breadcrumbs').empty();
                })
            },
            
            clickBreadcrumb = function(data){
                $('.breadcrumb h2').click(function (e){
                    var totalCrumbs = $('.breadcrumb')
                    console.log(":)", length, $(totalCrumbs[0]).find('h2').text())
                    for (var b = 0; b < totalCrumbs.length; b++){
                        // console.log($(this).find('h2').text())
                        if ($(totalCrumbs[b]).find('h2').text() === $(e.currentTarget).text()){
                            var newCrumbs = $('.breadcrumb').splice(0, b+1)
                            $('.breadcrumbs').empty().append(newCrumbs);
                        }
                    }
                    configureBreadcrumbs();
                    populateSubCategories(e);
                })

                    // Get All refinements from click and breadcrumbs
                    // Run ajax call to get new results 
                    // Delete breadcrumbs after the click
                    // 
            },

            configureBreadcrumbs = function(){
                if ($('.breadcrumb').length > 1){
                    $(".crumb_x").hide();
                    $(".crumb").css("display", "inline-block");
                    $('.breadcrumb').last().find(".crumb").hide();
                } else {
                    $('.breadcrumb').last().find(".crumb").hide();
                    $(".crumb_x").show();
                }
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

            checkboxState = function(data){
                var refinements = JSON.parse(data)
                for (var t = 0; t < refinements.length; t++){
                    $('.category-text').each(function(){
                        if ($(this).text() === refinements[t].value){
                            $(this).parent().find('.filter-checkbox').prop('checked', true);
                        }
                    })
                }

            },

            clickCheckBox = function(){
                $el.find(".filter-checkbox").click(function(e){
                    console.log($(e.currentTarget).closest('.filter').find('h3.category-text').trigger('click'));
                    // $(e.currentTarget).parent().find("input.filter-checkbox").trigger('click');
                })
            },

            resetNav = function(){
                $('.search_container').on("clearBreadcrumbs", function(){
                    contentToFilter.initialize({
                         el: '.results'
                    });
                    initialize({
                        el: '.filters_nav'
                    })
                })
                return false
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

            rerenderFilter = function(data){
                $el.empty().append(template({
                    categories: data.availableNavigation[0],
                    filters: reFilter(data.availableNavigation),
                    resources: getResources(data.availableNavigation)
                }));
                setupNav(data["selectedNavigation"]);
                configureNavDisplay();
            },

            rerenderNav = function(data){
                // SEARCH FOR DOM ELEMENT BY 'name' property and update that
                if (data.navigation){
                    $('.filter_group').each(function(){
                        if ($(this).find('.category_level').text() === data.navigation.name){
                            $(this).empty().append(template({
                                'categories': data.navigation
                            }));
                        }
                    })
                } else {
                    if (data.availableNavigation[0]['name'] !== "categories.categories.value"){
                        $('.filters_nav').empty().append(template({
                            categories: data.availableNavigation[0],
                            filters: reFilter(data.availableNavigation),
                            resources: getResources(data.availableNavigation)
                        }));
                    } else {
                        $('.filters_nav').empty().append(template({
                            categories: data.availableNavigation[0],
                            filters: reFilter(data.availableNavigation)
                        }));
                    }
                }
                updatePage(data);
                console.log("TESTTESTTEST", data['selectedNavigation'])
                setupNav(data["selectedNavigation"]);
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