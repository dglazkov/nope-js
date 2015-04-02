~function() {
  // FIXME: write actual tests.
  describe("HTMLDocument's dynamic markup insertion", function() {
    it("should throw for write", function() {
      assert.throws(function() {
        document.write('test');
      });
    });

    it("should throw for writeln", function() {
      assert.throws(function() {
        document.writeln('test');
      });
    });

    it("should throw for open", function() {
      assert.throws(function() {
        document.open();
      });
    });

    it("should throw for close", function() {
      assert.throws(function() {
        document.close();
      });
    });

  });
}();
