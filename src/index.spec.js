const CustomAllOf = (array, fn) => {
  if(array.length === 0)
    return true;
  const [head, ...tail] = array;
  return fn(head) && CustomAllOf(tail, fn);
}

const CustomFilter = (array, fn = () => true) => {
  if (array.length === 0) return []
  const [head, ...tail] = array
  return (fn(head) ? [head] : []).concat(CustomFilter(tail, fn))
}

const CustomFold = (array, fn, acc = []) => {
  if (!array.length) return acc
  const [head, ...tail] = array
  return CustomFold(tail, fn, fn(acc, head))
}

const reducer = (acc, elm) => {
  if (acc.length) {
    acc[acc.length - 1].end = elm.start
    if(acc[acc.length - 1].state === elm.state)
      return acc
  } 
  return [...acc, {...elm, end: null}]
}

describe('CustomAllOf', () => {
  it('return true is array is empty', () => {
    expect(CustomAllOf([], () => true)).toBe(true);
  })
  it('return true is array is empty', () => {
    expect(CustomAllOf([], () => false)).toBe(true);
  })
  it('return true if first elem supequal 1', () => {
    expect(CustomAllOf([1], (num) => num >= 1)).toBe(true);
  })
  it('return true if all elem supequal 1', () => {
    expect(CustomAllOf([1, 0, 2, 3], (num) => num >= 1)).toBe(false);
  })
})

describe('CustomFilter', () => {
  it('should return empty on empty array', () => {
    expect(CustomFilter([])).toEqual([])
  })
  it('should return empty on empty array', () => {
    expect(CustomFilter(['test'], () => true)).toEqual(['test'])
  })
  it('should return empty on empty array', () => {
    expect(CustomFilter(['test'], () => false)).toEqual([])
  })
  it('should return empty on empty array', () => {
    expect(CustomFilter([1, 2], (num) => num > 1)).toEqual([2])
  })
})

describe.only('CustomFold', () => {
  it('should return empty on empty array', () => {
    expect(CustomFold([])).toEqual([])
  })

  it('should not end last element', () => {
    expect(CustomFold([{
      state: 1,
      start: 1,
    }], reducer)).toEqual([{
      state: 1,
      start: 1,
      end: null
    }])
  })

  it('should not end last element', () => {
    const input = [{
      state: 1,
      start: 1,
    },{
      state: 2,
      start: 2,
    }]

    expect(CustomFold(input, reducer)).toEqual([{
      state: 1,
      start: 1,
      end: 2
    },{
      state: 2,
      start: 2,
      end: null
    }])
  })

  it('should not end last element', () => {
    const input = [{
      state: 1,
      start: 1,
    },{
      state: 1,
      start: 2,
    },{
      state: 2,
      start: 3,
    }]

    expect(CustomFold(input, reducer)).toEqual([{
      state: 1,
      start: 1,
      end: 3
    },{
      state: 2,
      start: 3,
      end: null
    }])
  })
})