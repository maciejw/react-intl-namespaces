import { Cancelable, CancelablePromise, delay, timer } from './delay';

describe('Cancelable delay', () => {
  it('should be possible to get notification from timer', async done => {
    const t = timer(10);
    const d = new Date();

    const getTime = () => new Date().getTime() - d.getTime();
    await t.next();
    await t.next();
    await t.next();
    await t.next();
    const x = await t.next(false);

    await t.next();

    await delay(1000);

    done();
  });
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
