/*
 * jquery-forms
 * https://github.com/yola/jquery-forms
 *
 * Copyright (c) 2013 Yola
 * Licensed under the MIT license.
 */

;(function($, window, document, undefined) {
  'use strict';
  var pluginName = 'Form',
        defaults = {
            submitting: false,
            message: null,
            data_attrs: {
                in_progress: 'in-progress',
                already_in_progress: 'already-in-progress',
                make_correction: 'make-correction',
                unknown_error: 'unknown-error',
                success: 'success'
            },
            redirect_param: 'next'
        };

  $.fn.form = function(options) {
    return this.each(function() {
      new Form(this, options);
    });
  };

  function Form(form, options) {
    this.$form = $(form);
    if (!(this.$form).is('form')) {
      throw "Excepts A Form Object";
    }

    this.options = $.extend(true, {}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;

    var self = this;
    this.$form.submit(function() {
       self.send();
    });

  };

  Form.prototype.getParam = function(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    if (results == null) {
      return null;
    }
    var result = results[1].replace(/\+/g, " ");

    return results == null ? false : decodeURIComponent(result);
  }

  Form.prototype.redirect = function(form, response) {
    var url_param_next = this.getParam(this.options.redirect_param);
    var data_attr_next = form.data(this.options.redirect_param);
    // var response_next = response[this.options.redirect_param];

    if (url_param_next) {
      window.location.assign(url_param_next);
    } else if (data_attr_next) {
      window.location.assign(data_attr_next);
    } //else if (response_next) {
    //   window.location.assign(response_next);
    // }
  };


  Form.prototype.send = function() {
        var self = this;
        $.ajax({
            type: "POST",
            url: this.url,
            data: this.data,
            success: function(data, textStatus, jqXHR) {
                self.options.message({

                });


                self.redirect(self.$form, data);
            },
            error: function(jqXHR, textStatus, errorThrown) {


                self.options.message({

                });

            },
            complete: function() {
            },
        });

        return false;
    };

}(jQuery));
