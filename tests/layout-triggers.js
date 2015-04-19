describe('offsetLeft', function() {
  it('should throw when document is in "write" mode', function() {
    var div = document.createElement('div');
    document.body.appendChild(div);
    document.setLifecycleMode('write');
    assert.throws(function() {
      var offsetLeft = div.offsetLeft;
    });
    document.body.removeChild(div);
  });

  it('should not throw when document is in "read" mode', function() {
    var div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = '10px';
    document.body.appendChild(div);
    document.setLifecycleMode('read');
    assert.doesNotThrow(function() {
      var offsetLeft = div.offsetLeft;
      assert.equal(offsetLeft, 10);
    });
    document.body.removeChild(div);
  });
});