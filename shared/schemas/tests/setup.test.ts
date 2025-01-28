describe('Test Environment Setup', () => {
  it('has the correct test environment', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });

  it('has working jest matchers', () => {
    expect(true).toBe(true);
    expect({ foo: 'bar' }).toEqual({ foo: 'bar' });
    expect(() => { throw new Error('test'); }).toThrow('test');
  });

  it('has working DOM environment', () => {
    const div = document.createElement('div');
    div.innerHTML = '<span>test</span>';
    expect(div.querySelector('span')).toBeTruthy();
    expect(div.textContent).toBe('test');
  });

  it('has working timers', () => {
    const callback = jest.fn();
    setTimeout(callback, 1000);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalled();
  });

  it('has working async/await support', async () => {
    const promise = Promise.resolve('test');
    const result = await promise;
    expect(result).toBe('test');
  });

  it('has working event handling', () => {
    const div = document.createElement('div');
    const callback = jest.fn();
    div.addEventListener('click', callback);
    div.click();
    expect(callback).toHaveBeenCalled();
  });

  it('has working localStorage mock', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.getItem('test')).toBe('value');
    localStorage.removeItem('test');
    expect(localStorage.getItem('test')).toBeNull();
  });

  it('has working fetch mock', () => {
    expect(fetch).toBeDefined();
    expect(typeof fetch).toBe('function');
  });
});
