describe('HTMLDocument.prototype.setLifecycleMode', function() {
  it('should not throw when "read" mode is specified', function() {
    assert.doesNotThrow(function() {
      document.setLifecycleMode('read');
    });
  });

  it('should not throw when "write" mode is specified', function() {
    assert.doesNotThrow(function() {
      document.setLifecycleMode('write');
    });
  });

  it('should throw when unknown mode is specified', function() {
    assert.throws(function() {
      document.setLifecycleMode('pancakes');
    });
  });

});