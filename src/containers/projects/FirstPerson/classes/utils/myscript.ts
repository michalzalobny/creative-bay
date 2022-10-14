export const xFn = () => {
  let _isPointerLocked = false;
  let _domElement;
  let _titleDomElement;
  let _counter = 0;

  const start = () => {
    _domElement = Array.from(document.getElementsByClassName('mycanvas'))[0];
    _domElement = document.body;
    _titleDomElement = Array.from(document.getElementsByClassName('title'))[0];
    _addEvents();
  };

  const _handleScreenClick = () => {
    if (_isPointerLocked) return;
    _domElement.requestPointerLock();
  };

  const _onPointerLockError = () => {
    console.error('InputControls: Unable to use Pointer Lock API');
  };

  const _onPointerLockChange = () => {
    if (_domElement.ownerDocument.pointerLockElement === _domElement) {
      _isPointerLocked = true;
    } else {
      _isPointerLocked = false;
    }
  };

  const _onMouseMove = event => {
    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    _counter += movementX;
    _titleDomElement.innerText = `DeltaX sum: ${_counter}`;
  };

  const _addEvents = () => {
    document.body.addEventListener('click', _handleScreenClick);
    _domElement.ownerDocument.addEventListener('mousemove', _onMouseMove);
    _domElement.ownerDocument.addEventListener('pointerlockchange', _onPointerLockChange);
    _domElement.ownerDocument.addEventListener('pointerlockerror', _onPointerLockError);
  };

  start();
};
