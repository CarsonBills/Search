var checkBoxHelper = (function () {
    'use strict';

    var clickCheckBox = function(){
        $('.search_container').find('.filter-checkbox').click(function(e){
            $(e.currentTarget).closest('.filter').find('h3.category-text').trigger('click');
        });
    };

    return {
        clickCheckBox: clickCheckBox
    };
}());

module.exports = checkBoxHelper;