;(function($) {
  'use strict';
  var pluginName = 'FormSubmitter',
    defaults = {
      submitting: false,
      data_attrs: {
        in_progress: 'in-progress',
        already_in_progress: 'already-in-progress',
        make_correction: 'make-correction',
        unknown_error: 'unknown-error',
        success: 'success'
      }
    };

  $.fn.formHandler = function(options) {
    return this.each(function() {
      new FormSubmitter(this, options);
    });
  };

  window.assignNewUrl = function() {
    window.location.assign(url);
  };

  function FormSubmitter(form, options) {
    this.form = $(form);
    if (!$(this.form).is('form')) {
      return;
    }
    this.options = $.extend(true, {}, defaults, options);

    this._defaults = defaults;
    this._name = pluginName;

    var submitFunction = function() {
      if (this.beforeSend()) {
        this.send();
      }
      return false;
    };

    this.form.submit(_.bind(submitFunction, this));
  }

  FormSubmitter.prototype.get_param = function(name) {
    name = name.replace(/[\[]/, "[").replace(/[\]]/, "]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    if (results === null) {
      return null;
    }
    var result = results[1].replace(/\+/g, " ");

    return results === null ? false : decodeURIComponent(result);
  };

  FormSubmitter.prototype.redirect = function(form) {
    var next = this.get_param('next') || form.data('redirect');
    var legacy_redirect = this.get_param('login-success_url');

    if (legacy_redirect) {
      next = legacy_redirect;
    }

    if (next) {
      assignNewUrl(next);
    }
  };

  FormSubmitter.prototype.to_data_attribute = function(error) {
      return error.toLowerCase().split(' ').join('-');
  };

  FormSubmitter.prototype.beforeSend = function() {
    if (this.submitting) {
      return false;
    }

    // If before send returns false we will abort the request
    if (this.options.hasOwnProperty('beforeSend') &&
      this.options.beforeSend(this.form) === false) {
      return false;
    }

    this.submitting = true;
    this.data = {};
    this.url = this.form.attr('action');

    this.serialize();

    return true;
  };

  FormSubmitter.prototype.serialize = function() {
    _.each(this.form.serializeArray(), function(item) {
      this.data[item.name] = item.value;
    }, this);

    if (!this.options.hasOwnProperty('data')) {
      return;
    }

    _.each(this.options.data, function(key, field) {
      if ($.isFunction(field)) {
        field = field(this.form);
      }

      if (field instanceof $) {
        this.data[key] = field.val();
      }
      else if (typeof field === 'string') {
        this.data[key] = field;
      }
      else if (field === false && this.data.hasOwnProperty(field)) {
        delete this.data[key];
      }
    }, this);
  };

  FormSubmitter.prototype.afterSuccess = function(data) {
    if (this.options.hasOwnProperty('afterSuccess')) {
      return this.options.afterSuccess(data);
    }
  };

  FormSubmitter.prototype.success = function(data, textStatus, jqXHR) {
    this.form.message({
      classes: 'alert alert-success',
      message_attribute: this.options.data_attrs.success,
    });

    var performRedirect = _.bind(this.redirect, this, this.form);

    if (this.options.hasOwnProperty('afterSuccess')) {
      $.when(this.afterSuccess(this.data)).done(performRedirect);
    } else {
      performRedirect();
    }
  };

  FormSubmitter.prototype.displayError = function(key, error){
    this.form.message({
      message: error,
      classes: 'alert alert-error alert-danger err-message',
      fallback_message_attribute: this.options.data_attrs.unknown_error,
      clean: false
    });
  };

  FormSubmitter.prototype.error = function(jqXHR, textStatus, errorThrown) {
    /* jQuery does not have errorThrown text for a 429 error, so we must
     * create or own
     */
    var errorThrownAttribute;

    if(jqXHR.status === 429) {
      errorThrown = 'TOO MANY REQUESTS';
    }

    errorThrownAttribute = this.to_data_attribute(errorThrown);
    this.form.message('close');

    _.each(jqXHR.responseJSON, this.displayError, this);

    this.form.message({
      classes: 'alert alert-error alert-danger make-correction',
      message_attribute: errorThrownAttribute,
      clean: false
    });

    this.form.message({
      classes: 'alert alert-error alert-danger make-correction',
      message_attribute: this.options.data_attrs.make_correction,
      clean: false
    });
  };

  FormSubmitter.prototype.send = function() {
    var complete = function() {
      this.submitting = false;
    };

    $.ajax({
      type: "POST",
      url: this.url,
      data: this.data,
      success: _.bind(this.success, this),
      error: _.bind(this.error, this),
      complete: _.bind(complete, this),
    });

    return false;
  };
})(jQuery);
