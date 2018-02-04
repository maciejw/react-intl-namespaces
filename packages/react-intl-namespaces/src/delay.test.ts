import { Cancelable, CancelablePromise, delay } from './delay';

describe('Cancelable delay', () => {
  it('should be possible to cancel delay', async done => {
    let d1: Promise<void> & Cancelable | undefined;

    expect.assertions(1);

    const waitFord1 = async () => {
      d1 = delay(1);
      await d1;
      expect(false).toBe(true);
    };

    waitFord1();

    if (d1) {
      d1.cancel();
      expect(true).toBe(true);
    }

    await delay(2);

    done();
  });
  it('should catch exception', done => {
    delay()
      .then(() => {
        throw new Error('error');
      })
      .catch(e => {
        expect(e).toEqual(new Error('error'));

        done();
      });
  });

  describe('CancelablePromise', () => {
    it('should catch error', done => {
      new CancelablePromise((r, reject) => {
        reject('error');
      }, () => void 0).catch(reason => {
        expect(reason).toEqual('error');
        done();
      });
    });
  });
});
