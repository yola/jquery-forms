define(function(require){
  'use strict';

  var $ = require('jquery');
  var _ = require('lodash');
  require('jquery-messages');
  require('jquery-forms');

  describe('formHandler', function() {
    it('adds itself as a jquery plugin', function() {
      expect(typeof $.fn.formHandler).toBe('function');
    });

    it("only accepts a form object", function() {
      var anchor = $('<a>');
      expect(anchor.formHandler).toThrow();
    });

    describe("AJAX requests", function() {
      var $form;

      beforeEach(function() {
        $form = $('<form>');
      });

      it("calls $.ajax", function() {
        spyOn($, 'ajax');
        $form.formHandler();
        $form.submit();
        expect($.ajax).toHaveBeenCalled();
      });
    });

    describe("Form submision on failure", function() {
      var $form;

      beforeEach(function() {
        $form = $('<form>');

        spyOn($, 'ajax').andCallFake(function(e) {
          e.error({responseJSON: ''}, '', 'SOME ERROR');
        });

        spyOn($.fn, 'message');

        $form.formHandler();
        $form.submit();
      });

      it("closes open messages", function() {
        expect($.fn.message).toHaveBeenCalledWith('close');
      });

      it("displays attribute errors on failure", function() {
        expect($.fn.message).toHaveBeenCalledWith({
          classes: 'alert alert-error alert-danger make-correction',
          message_attribute: 'some-error',
          clean: false
        });
      });

      it("displays the make a correction message on failure", function() {
        expect($.fn.message).toHaveBeenCalledWith({
          classes: 'alert alert-error alert-danger make-correction',
          message_attribute: 'make-correction',
          clean: false
        });
      });
    });

    describe("Form submision on success", function() {
      var $form;

      beforeEach(function() {
        $form = $('<form>');

        spyOn($, 'ajax').andCallFake(function(e) {
          e.success();
        });

        spyOn($.fn, 'message');

        $form.formHandler();
        $form.submit();
      });

      it("displays notice on success", function() {
        expect($.fn.message).toHaveBeenCalledWith({
          classes: 'alert alert-success',
          message_attribute: 'success'
        });
      });

      it("redirects", function() {
        spyOn(window, 'assignNewUrl');
        $form = $('<form>');
        $form.data('redirect', 'some-url')
        $form.formHandler();
        $form.submit();
        expect(window.assignNewUrl).toHaveBeenCalledWith('some-url');
      });

      it("calls the users beforeSend function before request", function() {
        
      });

      it("calls after send", function() {});

      it("stores optional peramerters", function() {});
    });

    describe("serialization", function() {
      var form;

      beforeEach(function() {
        // what type of form should I create?
          form = $("")
          $("body").append(form);
      });

      afterEach(function() {
        form.remove();
        form = null;
      });

      it("can black list fields", function() {});

      it("can add fields", function() {});

      it("can overwrite fields", function() {});

      describe("takes multiple input types", function() {
        it("jquery object", function() {});

        it("serializes a string", function() {});

        it("serializes a function", function() {});
      });
    });
  });
});
