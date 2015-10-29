/*******************************************************************************
 *  Copyright (C) 2012-2015 eBay Software Foundation
 *  This program is dual licensed under the MIT and Apache 2.0 licenses.
 *  Please see LICENSE for more information.
 *******************************************************************************/

// jscs:disable disallowSpacesInFunctionExpression
// jscs:disable disallowSpacesInAnonymousFunctionExpression
// jscs:disable validateQuoteMarks
$(function() {

  //Easy access to options
  var o = $.AdminLTE.options;

  /* PushMenu()
   * ==========
   * Adds the push menu functionality to the sidebar.
   *
   * @type Function
   * @usage: $.AdminLTE.pushMenu("[data-toggle='offcanvas']")
   */
  $.AdminLTE.pushMenu.activate = function (toggleBtn) {
    //Get the screen sizes
    var screenSizes = $.AdminLTE.options.screenSizes;

    //Enable sidebar toggle
    //$(toggleBtn).on('click', function (e) {
    $(document).on("click", toggleBtn,  function (e) {
      e.preventDefault();

      //Enable sidebar push menu
      if ($(window).width() > (screenSizes.sm - 1)) {
        if ($("body").hasClass('sidebar-collapse')) {
          $("body").removeClass('sidebar-collapse').trigger('expanded.pushMenu');
        } else {
          $("body").addClass('sidebar-collapse').trigger('collapsed.pushMenu');
        }
      }

      //Handle sidebar push menu for small screens
      else {
        if ($("body").hasClass('sidebar-open')) {
          $("body").removeClass('sidebar-open').removeClass('sidebar-collapse').trigger('collapsed.pushMenu');
        } else {
          $("body").addClass('sidebar-open').trigger('expanded.pushMenu');
        }
      }
    });

    $(".content-wrapper").click(function () {
      //Enable hide menu when clicking on the content-wrapper on small screens
      if ($(window).width() <= (screenSizes.sm - 1) && $("body").hasClass("sidebar-open")) {
        $("body").removeClass('sidebar-open');
      }
    });

    //Enable expand on hover for sidebar mini
    if ($.AdminLTE.options.sidebarExpandOnHover || ($('body').hasClass('fixed') && $('body').hasClass('sidebar-mini'))) {
      this.expandOnHover();
    }
  };

  //Activate sidebar push menu
  if (o.sidebarPushMenu) {
    $.AdminLTE.pushMenu.activate(o.sidebarToggleSelector);
  }

});