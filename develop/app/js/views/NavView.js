var Config = require('modules/Config'),
    contentToFilter = require('views/ContentView.js'),
    searchHelper = require('modules/search_helper'),
    googleHelper = require('modules/google_helper'),
    template = require('modules/navTemplate.hbs'),
    NavView = (function () {
        'use strict';
        var $el,
            returnedData,
            refinements,
            CONTEXT = 'availableNavigation',

            initialize = function (options) {
                $el = $(options.el);
                checkRedirect();
                initrender();
                collapseCategory();
                filterCheckBox();
                clickCheckBox();
                setupNav();
                configureNavDisplay();
                resetNav();
                moreRefinements();
                moreRecords();
                sortRecords();
                populateSearchBar();
                submitSearchBar();
                saytHighlight();
            },

            updatePage = function(data){
                // resetNav();
                configureNavDisplay();
                moreRefinements(data['selectedNavigation']);
                moreRecords(data['selectedNavigation']);
            },

            setupNav = function(data){
                refinements = data;
                $el.find('h3.category-text').click(function (e) {
                    populateSubCategories(e);
                });
            },

            submitSearchBar = function(){
                $('#ctl00_searchbtn').click(function(event){
                    event.preventDefault();
                    var query = searchHelper.getSearchBarQuery();
                    var search = scrapeQuery(query);
                    window.location.href = search;
                });
            },

            saytHighlight = function(){
                $('#ctl00_searchtext').keyup(function(){
                    if ($('#ctl00_searchtext').val().length >= 3){
                        var match = $('#ctl00_searchtext').val();
                        var regex = new RegExp(match, 'gi');
                        setTimeout(function(){
                            $('.sayt-result').each(function(){
                                $(this).find('.sayt-title').html($(this).find('.sayt-title').html().replace(regex, '<b>'+ match[0].toUpperCase()+match.slice(1) + '</b>'));
                                $(this).find('.sayt-author').html($(this).find('.sayt-author').html().replace(regex, '<b>'+ match[0].toUpperCase()+match.slice(1) + '</b>'));               
                            });
                        }, 500);
                    }
                });
            },

            scrapeQuery = function(query){
                // unformatted isbn, convert to formatted and redirect there
                if (query.search(/^([0-9]{13})$/) === 0){
                    var splitQuery = query.split('');
                    var indices = [3, 5, 9, 15];
                    for (var f = 0; f < indices.length; f++){
                        splitQuery.splice(indices[f], 0, '-');
                    }
                    return 'http://books.wwnorton.com/books/'+splitQuery.join('')+'';
                } else if (query.indexOf('+') === -1 && query.search(/[0-9]{3}-[0-9]-[0-9]{3}-[0-9]{5}-[0-9]/) === -1) {
                    // if single term query, and not an isbn, add * to widen results
                    query = query + '*';
                }
                if (query.search(/[0-9]{3}-[0-9]-[0-9]{3}-[0-9]{5}-[0-9]/) === 0){
                    // Keep formatted isbn and redirect to the book
                    return 'http://books.wwnorton.com/books/'+query+'';
                } else if (query.includes('"') || query.includes("'") ) {
                    // Delete quotes and apostrophes
                    var searchQuery = query.replace(/"/g, '').replace(/'/g, '');
                    return '/books/search-result.aspx?searchtext='+searchQuery+'';
                } else {
                    // Normal search, not additions
                    return '/books/search-result.aspx?searchtext='+query+'';
                }
            },

            populateSearchBar = function(){
                var query = searchHelper.getUrlQuery();
                if (query){
                    $('#ctl00_searchtext').val(query.replace(/\+/g, ' ').replace(/\*/g, ''));
                }
            },

            checkRedirect = function(){
                var data = Config.get();
                if (data.redirect){
                    window.location.href = data.redirect;
                }
            },

            populateSubCategories = function(e){
                var domRefinements = searchHelper.domRefinements(e);
                var searchQuery = searchHelper.getUrlQuery();
                if (domRefinements){
                    $.ajax({
                        url: '//stg-services.wwnorton.com/search/search.php',
                        method: 'POST',
                        data: {
                            'collection': 'dummyDevTwo',
                            'area': 'dummyDevTwo',
                            'query': searchQuery,
                            'fields': ['*'],
                            'refinements': domRefinements,
                            'pruneRefinements': false,
                            'skip': 0,
                            'pageSize': 15
                        },
                        success: function(data){
                            if (e){
                                if ($(e.currentTarget).closest('.filters_checkboxes').siblings('.category_level').text().includes('categories') || $(e.currentTarget).parent().hasClass('breadcrumb')){
                                    //update Nav
                                    rerenderNav(JSON.parse(data).data);
                                } else {
                                    rerenderFilter(JSON.parse(data).data);
                                }
                            }
                            else {
                                rerenderFilter(JSON.parse(data).data);
                            }
                            // update Content
                            contentToFilter.showFiltered(JSON.parse(data).data);
                            buildBreadcrumb(domRefinements);
                            moreRecords(JSON.parse(data).data);
                            checkboxState(domRefinements);
                            // clickCheckBox();
                            sortRecords();
                            collapseCategory();
                            configureNavDisplay();
                        }
                    });
                } else {

                    $.ajax({
                        url: '//stg-services.wwnorton.com/search/search.php',
                        method: 'POST',
                        data: {
                            'collection': 'dummyDevTwo',
                            'area': 'dummyDevTwo',
                            'query': searchQuery,
                            'fields': ['*'],
                            'pruneRefinements': false,
                            'skip': 0,
                            'pageSize': 15
                        },
                        success: function(data){
                            if (e){
                                if ($(e.currentTarget).closest('.filters_checkboxes').siblings('.category_level').text().includes('categories') || $(e.currentTarget).parent().hasClass('breadcrumb')){
                                    //update Nav
                                    rerenderNav(JSON.parse(data).data);
                                } else {
                                    rerenderFilter(JSON.parse(data).data);
                                }
                            }
                            else {
                                rerenderFilter(JSON.parse(data).data);
                            }
                            // update Content
                            contentToFilter.showFiltered(JSON.parse(data).data);
                            moreRecords(JSON.parse(data).data);
                            // clickCheckBox();
                            sortRecords();
                            collapseCategory();
                            emptyBreadcrumbs();
                            configureNavDisplay();
                        }
                    });
                }
            },

            moreRefinements = function(){
                $el.find('.nav_show_more').click(function(e){
                    console.log("******")
                    refinements = searchHelper.domRefinements(e);
                    var searchQuery = searchHelper.getUrlQuery();
                    $.ajax({
                        url: '//stg-services.wwnorton.com/search/search.php?more_ref=1',
                        method: 'POST',
                        data: {
                            'collection': 'dummyDevTwo',
                            'area': 'dummyDevTwo',
                            'navigationName': $(e.currentTarget).parent().siblings('.category_level').text(),
                            'query': searchQuery,
                            'refinements': refinements
                        },
                        success: function(data){
                            rerenderNav(JSON.parse(data).data);
                        }
                    });
                });
            },

            moreRecords = function(data){
                $('.show_more').click(function(e){
                    var calls = Math.ceil((parseInt($('.current_results').text())+15)/100);
                    if (data && data.selectedNavigation && data.records){
                        refinements = searchHelper.domRefinements(e);
                    } else {
                        refinements = '';
                    }
                    var sort = searchHelper.getSort();
                    // if (refinements && sort[1] !== ""){
                    var searchQuery = searchHelper.getUrlQuery();

                    if (refinements && sort[1] !== ''){
                        $.ajax({
                            url: '//stg-services.wwnorton.com/search/search.php',
                            method: 'POST',
                            data: {
                                'collection': 'dummyDevTwo',
                                'area': 'dummyDevTwo',
                                'query': searchQuery,
                                'fields': ['*'],
                                'sort': {
                                    'field': sort[0],
                                    'order': sort[1]
                                },
                                'refinements': refinements,
                                'pruneRefinements': false,
                                'skip': searchHelper.moreRecordsSkip(calls),
                                'pageSize': searchHelper.recordsPageSize(calls)
                            },
                            success: function(data){
                                if (calls > 1){
                                    for (var g = 0; g < JSON.parse(data).data['records'].length; g++){
                                        returnedData.data['records'].push(JSON.parse(data).data['records'][g]);
                                    }
                                    // returnedData.data['records'].push(JSON.parse(data).data['records']);
                                } else {
                                    returnedData = JSON.parse(data);
                                }
                                contentToFilter.showFiltered(returnedData.data);
                                if ($(e.currentTarget).closest('.filters_checkboxes').siblings('.category_level').text().includes('categories') || $(e.currentTarget).parent().hasClass('breadcrumb')){
                                    //update Nav
                                    rerenderNav(JSON.parse(data).data);
                                } 
                                // update Content
                                buildBreadcrumb(refinements);
                                moreRecords(JSON.parse(data).data);
                                sortRecords();
                                resetSortBox(sort);
                            }
                        });
                    } else if (sort[1] !== ''){
                        $.ajax({
                            url: '//stg-services.wwnorton.com/search/search.php',
                            method: 'POST',
                            data: {
                                'collection': 'dummyDevTwo',
                                'area': 'dummyDevTwo',
                                'query': searchQuery,
                                'fields': ['*'],
                                'sort': {
                                    'field': sort[0],
                                    'order': sort[1]
                                },
                                'pruneRefinements': false,
                                'skip': searchHelper.moreRecordsSkip(calls),
                                'pageSize': searchHelper.recordsPageSize(calls)
                            },
                            success: function(data){
                                if (calls > 1){
                                    for (var g = 0; g < JSON.parse(data).data['records'].length; g++){
                                        returnedData.data['records'].push(JSON.parse(data).data['records'][g]);
                                    }
                                    // returnedData.data['records'].push(JSON.parse(data).data['records']);
                                } else {
                                    returnedData = JSON.parse(data);
                                }
                                contentToFilter.showFiltered(returnedData.data);
                                if ($(e.currentTarget).closest('.filters_checkboxes').siblings('.category_level').text().includes('categories') || $(e.currentTarget).parent().hasClass('breadcrumb')){
                                    //update Nav
                                    rerenderNav(JSON.parse(data).data);
                                } 
                                // update Content                
                                moreRecords(JSON.parse(data).data);
                                sortRecords();
                                resetSortBox(sort);
                            }
                        });
                    } else if (refinements){
                        $.ajax({
                            url: '//stg-services.wwnorton.com/search/search.php',
                            method: 'POST',
                            data: {
                                'collection': 'dummyDevTwo',
                                'area': 'dummyDevTwo',
                                'query': searchQuery,
                                'fields': ['*'],
                                'refinements': refinements,
                                'pruneRefinements': false,
                                'skip': searchHelper.moreRecordsSkip(calls),
                                'pageSize': searchHelper.recordsPageSize(calls)
                            },
                            success: function(data){
                                if (calls > 1){
                                    for (var g = 0; g < JSON.parse(data).data['records'].length; g++){
                                        returnedData.data['records'].push(JSON.parse(data).data['records'][g]);
                                    }
                                    // returnedData.data['records'].push(JSON.parse(data).data['records']);
                                } else {
                                    returnedData = JSON.parse(data);
                                }
                                contentToFilter.showFiltered(returnedData.data);
                                if ($(e.currentTarget).closest('.filters_checkboxes').siblings('.category_level').text().includes('categories') || $(e.currentTarget).parent().hasClass('breadcrumb')){
                                    //update Nav
                                    rerenderNav(JSON.parse(data).data);
                                } 
                                // update Content                
                                moreRecords(JSON.parse(data).data);
                                sortRecords();
                                resetSortBox(sort);
                            }
                        });
                    } else {
                        $.ajax({
                            url: '//stg-services.wwnorton.com/search/search.php',
                            method: 'POST',
                            data: {
                                'collection': 'dummyDevTwo',
                                'area': 'dummyDevTwo',
                                'query': searchQuery,
                                'fields': ['*'],
                                'pruneRefinements': false,
                                'skip': searchHelper.moreRecordsSkip(calls),
                                'pageSize': searchHelper.recordsPageSize(calls)
                            },
                            success: function(data){
                                if (calls > 1){
                                    for (var g = 0; g < JSON.parse(data).data['records'].length; g++){
                                        returnedData.data['records'].push(JSON.parse(data).data['records'][g]);
                                    }
                                    // returnedData.data['records'].push(JSON.parse(data).data['records']);
                                } else {
                                    returnedData = JSON.parse(data);
                                }
                                // returnedData.data['records'].push(JSON.parse(data).data);
                                contentToFilter.showFiltered(returnedData.data);
                                if ($(e.currentTarget).closest('.filters_checkboxes').siblings('.category_level').text().includes('categories') || $(e.currentTarget).parent().hasClass('breadcrumb')){
                                    //update Nav
                                    rerenderNav(JSON.parse(data).data);
                                }
                                // update Content
                                moreRecords(JSON.parse(data).data);
                                sortRecords();
                                resetSortBox(sort);
                            }
                        });
                    }
                });    
            },

            sortRecords = function(){
                $('select.sort_select').change(function(){
                    var totalcalls = Math.ceil((parseInt($('.current_results').text()))/100);
                    refinements = searchHelper.domRefinements();
                    var searchQuery = searchHelper.getUrlQuery();
                    var sort = searchHelper.getSort();
                    var oldData = returnedData;
                    if (refinements && sort[1] !== ''){
                        $.ajax({
                            url: '//stg-services.wwnorton.com/search/search.php',
                            method: 'POST',
                            data: {
                                'collection': 'dummyDevTwo',
                                'area': 'dummyDevTwo',
                                'query': searchQuery,
                                'fields': ['*'],
                                'sort': {
                                    'field': sort[0],
                                    'order': sort[1]
                                },
                                'refinements': refinements,
                                'pruneRefinements': false,
                                'skip': searchHelper.recordsSkip(totalcalls),
                                'pageSize': searchHelper.sortRecordsPageSize(totalcalls)
                            },
                            success: function(data){
                                if (totalcalls > 1){
                                    oldData.data['records'] = [];
                                    for (var g = 0; g < JSON.parse(data).data['records'].length; g++){
                                        oldData.data['records'].push(JSON.parse(data).data['records'][g]);
                                    }
                                    var callsleft = totalcalls - 1;
                                    if (callsleft >= 1){
                                        sortRecordsCallback(totalcalls, callsleft, oldData);
                                    }
                                    // returnedData.data['records'].push(JSON.parse(data).data['records']);
                                } else {
                                    oldData = JSON.parse(data);
                                    // update Content                
                                    contentToFilter.showFiltered(oldData.data);
                                    buildBreadcrumb(refinements);
                                    moreRecords(JSON.parse(data).data);
                                    checkboxState(refinements);
                                    clickCheckBox();
                                    sortRecords();
                                    filterCheckBox();
                                    resetSortBox(sort);
                                }
                            }
                        });
                    } else if (sort[1] !== ''){
                        $.ajax({
                            url: '//stg-services.wwnorton.com/search/search.php',
                            method: 'POST',
                            data: {
                                'collection': 'dummyDevTwo',
                                'area': 'dummyDevTwo',
                                'query': searchQuery,
                                'fields': ['*'],
                                'sort': {
                                    'field': sort[0],
                                    'order': sort[1]
                                },
                                'pruneRefinements': false,
                                'skip': searchHelper.recordsSkip(totalcalls),
                                'pageSize': searchHelper.sortRecordsPageSize(totalcalls)
                            },
                            success: function(data){
                                if (totalcalls > 1){
                                    oldData.data['records'] = [];
                                    for (var g = 0; g < JSON.parse(data).data['records'].length; g++){
                                        oldData.data['records'].push(JSON.parse(data).data['records'][g]);
                                    }
                                    var callsleft = totalcalls - 1;
                                    if (callsleft >= 1){
                                        sortRecordsCallback(totalcalls, callsleft, oldData);
                                    }
                                } else {
                                    oldData = JSON.parse(data);
                                    // update Content    
                                    contentToFilter.showFiltered(oldData.data);
                                    moreRecords(JSON.parse(data).data);
                                    clickCheckBox();
                                    sortRecords();
                                    filterCheckBox();
                                    resetSortBox(sort);
                                }       
                            }
                        });
                    } else if (refinements){
                        $.ajax({
                            url: '//stg-services.wwnorton.com/search/search.php',
                            method: 'POST',
                            data: {
                                'collection': 'dummyDevTwo',
                                'area': 'dummyDevTwo',
                                'query': searchQuery,
                                'fields': ['*'],
                                'refinements': refinements,
                                'pruneRefinements': false,
                                'skip': searchHelper.recordsSkip(totalcalls),
                                'pageSize': searchHelper.sortRecordsPageSize(totalcalls)
                            },
                            success: function(data){
                                if (totalcalls > 1){
                                    oldData.data['records'] = [];
                                    for (var g = 0; g < JSON.parse(data).data['records'].length; g++){
                                        oldData.data['records'].push(JSON.parse(data).data['records'][g]);
                                    }
                                    var callsleft = totalcalls - 1;
                                    if (callsleft >= 1){
                                        sortRecordsCallback(totalcalls, callsleft, oldData);
                                    }
                                    // returnedData.data['records'].push(JSON.parse(data).data['records']);
                                } else {
                                    oldData = JSON.parse(data);             
                                    contentToFilter.showFiltered(oldData.data);
                                    buildBreadcrumb(refinements);
                                    checkboxState(refinements);
                                    moreRecords(JSON.parse(data).data);
                                    clickCheckBox();
                                    sortRecords();
                                    filterCheckBox();
                                    resetSortBox(sort);
                                }
                                // update Content  
                            }
                        });
                    } else {
                        $.ajax({
                            url: '//stg-services.wwnorton.com/search/search.php',
                            method: 'POST',
                            data: {
                                'collection': 'dummyDevTwo',
                                'area': 'dummyDevTwo',
                                'query': searchQuery,
                                'fields': ['*'],
                                'pruneRefinements': false,
                                'skip': searchHelper.recordsSkip(totalcalls),
                                'pageSize': searchHelper.sortRecordsPageSize(totalcalls)
                            },
                            success: function(data){
                                // var pagesize = searchHelper.sortRecordsPageSize(calls)
                                if (totalcalls > 1){
                                    oldData.data['records'] = [];
                                    for (var g = 0; g < JSON.parse(data).data['records'].length; g++){
                                        oldData.data['records'].push(JSON.parse(data).data['records'][g]);
                                    }
                                    var callsleft = totalcalls - 1;
                                    if (callsleft >= 1){
                                        sortRecordsCallback(totalcalls, callsleft, oldData);
                                    }
                                    // returnedData.data['records'].push(JSON.parse(data).data['records']);
                                } else {
                                    oldData = JSON.parse(data);             
                                    contentToFilter.showFiltered(oldData.data);
                                    moreRecords(JSON.parse(data).data);
                                    clickCheckBox();
                                    sortRecords();
                                    filterCheckBox();
                                    resetSortBox(sort);
                                }
                                // update Content  
                            }
                        });
                    }
                });
            },


//  This function exists to show more than 100 records
            sortRecordsCallback = function(totalcalls, callsleft, oldData){
                // var calls = Math.ceil((parseInt($('.current_results').text()))/100);
                refinements = searchHelper.domRefinements();
                var searchQuery = searchHelper.getUrlQuery();
                var sort = searchHelper.getSort();
                if (refinements && sort[1] !== ''){
                    $.ajax({
                        url: '//stg-services.wwnorton.com/search/search.php',
                        method: 'POST',
                        data: {
                            'collection': 'dummyDevTwo',
                            'area': 'dummyDevTwo',
                            'query': searchQuery,
                            'fields': ['*'],
                            'sort': {
                                'field': sort[0],
                                'order': sort[1]
                            },
                            'refinements': refinements,
                            'pruneRefinements': false,
                            'skip': searchHelper.sortRecordsSkip(totalcalls, callsleft),
                            'pageSize': searchHelper.sortCallbackPageSize(totalcalls, callsleft)
                        },
                        success: function(data){
                            if (totalcalls > 1){
                                for (var g = 0; g < JSON.parse(data).data['records'].length; g++){
                                    oldData.data['records'].push(JSON.parse(data).data['records'][g]);
                                }
                                // returnedData.data['records'].push(JSON.parse(data).data['records']);
                                callsleft = callsleft - 1;
                                if (callsleft >= 1){
                                    sortRecordsCallback(totalcalls, callsleft, oldData);
                                }
                            } else {
                                oldData = JSON.parse(data);
                            }
                            // update Content                
                            contentToFilter.showFiltered(oldData.data);
                            buildBreadcrumb(refinements);
                            moreRecords(JSON.parse(data).data);
                            checkboxState(refinements);
                            clickCheckBox();
                            sortRecords();
                            filterCheckBox();
                            resetSortBox(sort);
                        }
                    });
                } else if (sort[1] !== ''){
                    $.ajax({
                        url: '//stg-services.wwnorton.com/search/search.php',
                        method: 'POST',
                        data: {
                            'collection': 'dummyDevTwo',
                            'area': 'dummyDevTwo',
                            'query': searchQuery,
                            'fields': ['*'],
                            'sort': {
                                'field': sort[0],
                                'order': sort[1]
                            },
                            'pruneRefinements': false,
                            'skip': searchHelper.sortRecordsSkip(totalcalls, callsleft),
                            'pageSize': searchHelper.sortCallbackPageSize(totalcalls, callsleft)
                        },
                        success: function(data){
                            if (totalcalls > 1){
                                for (var g = 0; g < JSON.parse(data).data['records'].length; g++){
                                    oldData.data['records'].push(JSON.parse(data).data['records'][g]);
                                }
                                callsleft = callsleft -1;
                                if (callsleft  >= 1){
                                    sortRecordsCallback(totalcalls, callsleft, oldData);
                                }
                            } else {
                                oldData = JSON.parse(data);
                            }
                            // update Content          
                            contentToFilter.showFiltered(oldData.data);
                            moreRecords(JSON.parse(data).data);
                            clickCheckBox();
                            sortRecords();
                            filterCheckBox();
                            resetSortBox(sort);
                        }
                    });
                } else if (refinements){
                    $.ajax({
                        url: '//stg-services.wwnorton.com/search/search.php',
                        method: 'POST',
                        data: {
                            'collection': 'dummyDevTwo',
                            'area': 'dummyDevTwo',
                            'query': searchQuery,
                            'fields': ['*'],
                            'refinements': refinements,
                            'pruneRefinements': false,
                            'skip': searchHelper.sortRecordsSkip(totalcalls, callsleft),
                            'pageSize': searchHelper.sortCallbackPageSize(totalcalls, callsleft)
                        },
                        success: function(data){
                            if (totalcalls > 1){
                                for (var g = 0; g < JSON.parse(data).data['records'].length; g++){
                                    oldData.data['records'].push(JSON.parse(data).data['records'][g]);
                                }
                                callsleft = callsleft - 1;
                                if (callsleft  >= 1){
                                    sortRecordsCallback(totalcalls, callsleft, oldData);
                                }
                            } else {
                                oldData = JSON.parse(data);
                            }
                            // update Content                
                            contentToFilter.showFiltered(oldData.data);
                            buildBreadcrumb(refinements);
                            checkboxState(refinements);
                            moreRecords(JSON.parse(data).data);
                            clickCheckBox();
                            sortRecords();
                            filterCheckBox();
                            resetSortBox(sort);
                        }
                    });
                } else {
                    $.ajax({
                        url: '//stg-services.wwnorton.com/search/search.php',
                        method: 'POST',
                        data: {
                            'collection': 'dummyDevTwo',
                            'area': 'dummyDevTwo',
                            'query': searchQuery,
                            'fields': ['*'],
                            'pruneRefinements': false,
                            'skip': searchHelper.sortRecordsSkip(totalcalls, callsleft),
                            'pageSize': searchHelper.sortCallbackPageSize(totalcalls, callsleft)
                        },
                        success: function(data){
                            if (totalcalls > 1){
                                for (var g = 0; g < JSON.parse(data).data['records'].length; g++){
                                    oldData.data['records'].push(JSON.parse(data).data['records'][g]);
                                }
                                callsleft = callsleft - 1;
                                if (callsleft >= 1){
                                    sortRecordsCallback(totalcalls, callsleft, oldData);
                                }
                            } else {
                                oldData = JSON.parse(data);
                            }
                            // update Content              
                            contentToFilter.showFiltered(oldData.data);
                            moreRecords(JSON.parse(data).data);
                            clickCheckBox();
                            sortRecords();
                            filterCheckBox();
                            resetSortBox(sort);
                        }
                    });
                }
            },

            resetSortBox = function(sort){
                var value = sort.join('-');
                $('select.sort_select option[sortvalue='+value+']').prop('selected', true);
            },

            buildBreadcrumb = function (refinements){
                $('.breadcrumbs').empty();
                refinements = JSON.parse(refinements);
                var breadcrumbs = [];
                for (var g = 0; g < refinements.length; g++){
                    if (refinements[g]['value'] !== '1'){
                        breadcrumbs.push({'name': refinements[g]['navigationName'], 'value' : refinements[g]['value']});
                    } else {
                        breadcrumbs.push({'name': refinements[g]['navigationName'], 'value' : 'Reading Guides'});
                    }
                }
                for (var h = 0; h < breadcrumbs.length; h++){
                    $('.breadcrumbs').append('<div name='+breadcrumbs[h].name+' class="breadcrumb">&nbsp<h2>' + breadcrumbs[h].value + '</h2>&nbsp<p class="crumb_x">x</p><p class="crumb">></p></div>'); 
                }
                configureBreadcrumbs();
                if (breadcrumbs.length === 1){
                    xBreadcrumb();
                }
                clickBreadcrumb();
            },

            xBreadcrumb = function (){
                $('p.crumb_x').click(function (){
                    $('.search_container').trigger('clearBreadcrumbs');
                    $('.breadcrumbs').empty();
                });
            },

            emptyBreadcrumbs = function(){
                $('.breadcrumbs').empty();
            },
            
            clickBreadcrumb = function(){
                $('.breadcrumb h2').click(function (e){
                    var totalCrumbs = $('.breadcrumb');
                    for (var b = 0; b < totalCrumbs.length; b++){
                        if ($(totalCrumbs[b]).find('h2').text() === $(e.currentTarget).text()){
                            var newCrumbs = $('.breadcrumb').splice(0, b+1);
                            $('.breadcrumbs').empty().append(newCrumbs);
                        }
                    }
                    configureBreadcrumbs();
                    populateSubCategories(e);
                });
            },

            configureBreadcrumbs = function(){
                if ($('.breadcrumb').length > 1){
                    $('.crumb_x').hide();
                    $('.crumb').css('display', 'inline-block');
                    $('.breadcrumb').last().find('.crumb').hide();
                } else {
                    $('.breadcrumb').last().find('.crumb').hide();
                    $('.crumb_x').show();
                }
            },

            innerCheckboxes = function(data){
                data.parent().find('.filter').each(function(){
                    if ($(this).find('input.filter-checkbox').prop('checked')){
                        data.find('.fa-chevron-down').css('display', 'inline');
                        data.find('.fa-chevron-right').css('display', 'none');
                        data.siblings('.filters_checkboxes').show();
                        return false;
                    } else {
                        data.find('.fa-chevron-down').css('display', 'none');
                        data.find('.fa-chevron-right').css('display', 'inline');
                        data.siblings('.filters_checkboxes').hide();
                    }
                });
            },

            configureNavDisplay = function(){
                $('.chevron').each(function(){
                    if ($(this).parent().hasClass('variants.volume') ||
                        $(this).parent().hasClass('edition_text') ||
                        $(this).parent().hasClass('s_int_reading_guides') ||
                        $(this).parent().hasClass('series')) {
                        innerCheckboxes($(this));
                    } else {
                        $(this).find('.fa-chevron-right').css('display', 'none');
                        $(this).find('.fa-chevron-down').css('display', 'inline');
                    }
                });
            },

            collapseCategory = function(){
                $el.find('.chevron, .nav_heading').off('click')
                $el.find('.chevron, .nav_heading').click(function (e) {
                    //hide content on click
                    $(e.currentTarget).siblings('.filters_checkboxes').toggleClass('collapsed').slideToggle('fast');
                    //change chevron
                    var current = $(e.currentTarget).parent().find('i:visible');
                    $(e.currentTarget).parent().find('i:hidden').show();
                    current.hide();
                });
            },

            initCategories = function(data){
                var categories = [];
                for (var b = 0; b < data.length; b++){
                    if (data[b]['name'] === 'categories.categories.value'){
                        categories = (data[b]);
                    }
                }
                return  categories;
            },

            initFilters = function(data){
                var filters = [];
                for (var b = 0; b < data.length; b++){
                    if (data[b]['name'] === 'variants.product_form' || data[b]['name'] === 'new_release'){
                        for (var x = 0; x < data[b]['refinements'].length; x++ ){
                            if (data[b]['refinements'][x]['value'] === '' ||
                            data[b]['refinements'][x]['value'] === '[]' ||
                            data[b]['refinements'][x]['value'] === 'VHS' ||
                            data[b]['refinements'][x]['value'] === 'Cassette'){
                                data[b]['refinements'].splice(x, 1);
                            }
                        }
                        if(data[b]['refinements'].length > 0){
                            filters.push(data[b]);
                        }
                    }
                }
                return filters;
            },

            filterCheckBox = function(){
                $el.find('.filter-text').click(function(e){
                    var gah = $(e.currentTarget).parent().find('input.filter-checkbox');
                    // If click from box, not text
                    if (e.originalEvent === undefined) {
                        // Do nothing
                    } else if (!$(e.currentTarget).parent().find('input.filter-checkbox').prop('checked')){
                        gah.prop('checked', !gah[0].checked);
                    } else {
                        gah.prop('checked', !gah[0].checked);
                    }
                });
            },

            checkboxState = function(data){
                var refinements = JSON.parse(data);
                for (var t = 0; t < refinements.length; t++){
                    $('.category-text').each(function(){
                        if ($(this).text() === refinements[t].value){
                            $(this).parent().find('.filter-checkbox').prop('checked', true);
                        } else if (refinements[t].value === '1' && $(this).text() === 'Reading Guides'){
                            $(this).parent().find('.filter-checkbox').prop('checked', true);
                        }
                    });
                }

            },

            clickCheckBox = function(){
                $el.find('.filter-checkbox').click(function(e){
                    // e.preventDefault;
                    $(e.currentTarget).closest('.filter').find('h3.category-text').trigger('click');
                });
            },

            resetNav = function(){
                $('.search_container').on('clearBreadcrumbs', function(){
                    contentToFilter.initialize({
                        el: '.results'
                    });
                    initialize({
                        el: '.filters_nav'
                    });
                });
                return false;
            },

            reCategories = function(data){

                if (data['name'] === 'categories.categories.value' ||
                    data['name'] === 'categories.categories.categories.value' ||
                    data['name'] === 'categories.categories.categories.categories.value' ||
                    data['name'] === 'categories.categories.categories.categories.categories.value' ||
                    data['name'] === 'categories.categories.categories.categories.categories.categories.value' ){
                    for (var x = 0; x < data['refinements'].length; x++ ){
                        if (data['refinements'][x]['value'] === '' || data['refinements'][x]['value'] === '[]'){
                            data['refinements'].splice(x, 1);
                        } 
                    }
                    if (data['refinements'].length !== 0){
                        return data;
                    }
                }
                return [];
            },

            reFilter = function(data){

                var filters = [];
                for (var b = 0; b < data.length; b++){

                    if (data[b]['name'] === 'variants.product_form' ||
                    data[b]['name'] === 'new_release' ||
                    data[b]['name'] === 'variants.volume' ||
                    data[b]['name'] === 'edition_text' ||
                    data[b]['name'] === 'series' ){
                        for (var x = 0; x < data[b]['refinements'].length; x++ ){
                            if (data[b]['refinements'][x]['value'] === '' ||
                            data[b]['refinements'][x]['value'] === '[]' ||
                            data[b]['refinements'][x]['value'] === 'VHS' ||
                            data[b]['refinements'][x]['value'] === 'Cassette'
                            ){
                                data[b]['refinements'].splice(x, 1);
                            } 
                        }
                        if (data[b]['refinements'].length !== 0){
                            filters.push(data[b]);
                        }
                    }
                }
                return filters;
            },

            getResources = function(data){
                var resources = [];
                for (var b = 0; b < data.length; b++){

                    if (data[b]['name'] === 's_int_reading_guides'){
                        for (var x = 0; x < data[b]['refinements'].length; x++ ){
                            if (data[b]['refinements'][x]['value'] === '0'){
                                data[b]['refinements'].splice(x, 1);
                            } 
                        }
                        if (data[b]['refinements'].length !== 0){
                            resources.push(data[b]);
                        }
                        
                    } 
                }
                return resources;
            },

            rerenderFilter = function(data){
                $el.empty().append(template({
                    categories: googleHelper.getGoogleData(reCategories(data.availableNavigation[0])),
                    filters: googleHelper.getGoogleFilterData(reFilter(data.availableNavigation)),
                    resources: googleHelper.getGoogleResourceData(getResources(data.availableNavigation))
                }));
                filterCheckBox();
                clickCheckBox();
                setupNav(data['selectedNavigation']);
            },

            rerenderNav = function(data){
                // SEARCH FOR DOM ELEMENT BY 'name' property and update that
                if (data.navigation){
                    // Show more categories
                    var that
                    $('.filter_group').each(function(){
                        if ($(this).find('.category_level').text() === data.navigation.name){
                            console.log("Yep", [data.navigation], $(this).find('.category_level').text())
                            that = $(this);
                            // $(e.currentTarget).closest('.filters_checkboxes').siblings('.category_level').text().includes('categories')
                            if ($(this).find('.category_level').text().includes('categories')){
                                $(this).empty().append(template({
                                    'categories': googleHelper.getGoogleData(reCategories(data.navigation))
                                }));
                            } else {
                                $(this).empty().append(template({
                                    'filters': googleHelper.getGoogleFilterData(reFilter([data.navigation]))
                                }));
                            }
                        }
                    });
                    updatePage(data);
                    collapseCategory();
                    // Only trigger click if the refinement does not show on default
                    if (data.navigation.name === 'variants.volume' ||
                        data.navigation.name === 'edition_text' ||
                        data.navigation.name === 'series' ){
                        that.find('.nav_heading').trigger('click');  
                    }
                } else {
                    if ($('div.categories').find('.category_level').text() === data.availableNavigation[0]['name'] && data.availableNavigation[0]['name'] !== 'categories.categories.categories.value'){
                        // When you hit the end of the category specificity, stop rendering same subcategory
                        $('.filters_nav').empty().append(template({
                            categories: [],
                            filters: googleHelper.getGoogleFilterData(reFilter(data.availableNavigation)),
                            resources: googleHelper.getGoogleResourceData(getResources(data.availableNavigation))
                        }));
                    } else if (data.availableNavigation[0]['name'] !== 'categories.categories.value'){
                        $('.filters_nav').empty().append(template({
                            categories: googleHelper.getGoogleData(reCategories(data.availableNavigation[0])),
                            filters: googleHelper.getGoogleFilterData(reFilter(data.availableNavigation)),
                            resources: googleHelper.getGoogleResourceData(getResources(data.availableNavigation))
                        }));
                    } else {
                        $('.filters_nav').empty().append(template({
                            categories: googleHelper.getGoogleData(reCategories(data.availableNavigation[0])),
                            filters: googleHelper.getGoogleFilterData(reFilter(data.availableNavigation))
                        }));
                    }
                    updatePage(data);
                }
                filterCheckBox();
                clickCheckBox();
                setupNav(data['selectedNavigation']);
            },

            initrender = function () {
                var context = Config.get(CONTEXT);
                $el.empty();
                if (initCategories(context).name && initFilters(context).length){
                    $el.append(template({
                        categories: googleHelper.getGoogleData(initCategories(context)),
                        filters: googleHelper.getGoogleFilterData(reFilter(context)),
                        resources: googleHelper.getGoogleResourceData(getResources(context))
                    }));
                } else if (initCategories(context).name){
                    $el.append(template({
                        categories: googleHelper.getGoogleData(initCategories(context))
                    }));
                } else if (initFilters(context).length){
                    $el.append(template({
                        filters: googleHelper.getGoogleFilterData(reFilter(context))
                    }));
                }
            };

        return {
            initialize: initialize
        };

    }());

module.exports = NavView;