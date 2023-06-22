import { getBreakPointBySize, hasShadowDom } from './utils';

describe('getBreakPointBySize retorna el punto de quiebre ', () => {
  it('punto de quiebre', () => {
    expect(getBreakPointBySize(10)).toBe('xs');
    expect(getBreakPointBySize(479)).toBe('xs');
    expect(getBreakPointBySize(480)).not.toBe('xs');

    expect(getBreakPointBySize(480)).toEqual('sm');
    expect(getBreakPointBySize(539)).toEqual('sm');
    expect(getBreakPointBySize(479)).not.toBe('sm');
    expect(getBreakPointBySize(540)).not.toBe('sm');

    expect(getBreakPointBySize(540)).toEqual('md');
    expect(getBreakPointBySize(767)).toEqual('md');
    expect(getBreakPointBySize(539)).not.toBe('md');
    expect(getBreakPointBySize(768)).not.toBe('md');

    expect(getBreakPointBySize(900)).toBe('lg');
  });

  it('valida shadowDom', () => {
    const el=document.createElement('div');
    expect(hasShadowDom(el)).toBe(false)
  })
});


