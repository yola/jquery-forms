describe("Form Plug-in", function() {
  it("should be initialized on the global jquery object", function() {
    expect($.fn.form()).toBeDefined();
  });

  it("only excepts a form object", function() {
    var anchor = $('<a>');
    expect(anchor.form).toThrow();
  });

  describe("AJAX requests", function() {
    var $form;

    beforeEach(function() {
      $form = $('<form>');
    });

    it("calls $.ajax", function() {
      spyOn($, 'ajax');
      $form.form();
      $form.submit();
      expect($.ajax).toHaveBeenCalled();
    });
  });

  describe("Form submision", function() {
    var $form;

    beforeEach(function() {
      $form = $('<form>');
    });

    it("displays errros on failure", function() {
      spyOn($, 'ajax').andCallFake(function(e) {
        e.error();
      });

      var callbacks = {
        message: jasmine.createSpy()
      };

      $form.form(callbacks);
      $form.submit();
      expect(callbacks.message).toHaveBeenCalled();
    });

    it("displays notice on success", function() {
      spyOn($, 'ajax').andCallFake(function(e) {
        e.success();
      });

      var callbacks = {
        message: jasmine.createSpy()
      };

      $form.form(callbacks);
      $form.submit();
      expect(callbacks.message).toHaveBeenCalled();
    });

    it("redirects after success", function() {

    });

    it("calls before send", function() {

    });

    it("calls after send", function() {

    });

    it("stores optional peramerters", function() {

    });
  });

  describe("Serializer", function() {
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

    it("can black list fields", function() {

    });

    it("can add fields", function() {

    });

    it("can overwrite fields", function() {

    });

    describe("takes multiple input types", function() {
      it("jquery object", function() {

      });

      it("string", function() {

      });

      it("function", function() {

      });
    });
  });
});


