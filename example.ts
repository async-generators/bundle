import bundle from './src';

async function delay(duration: number) {
  return new Promise(r => setTimeout(r, duration));
}

function throttle(period) {
  let next;
  return function () {
    let start = function(){
      next = false;
      console.log("started timeout", period);
      setTimeout(function () { 
        next = true; 
        console.log("timed-out");
      }, period);
    }

    if (next === undefined) {
      start();
      return true;
    }
    if (next) {      
      start();
      return false;
    }
    if (next) {      
      next = undefined;
      return false;
    }
    return true;
  }
}

async function main() {
  let source = async function* () {
    for (let i = 0; i < 10; i++) {   
      console.log("source yield", i);   
      yield i;      
      await delay(100);     
    }
  }

  for await (let items of bundle(source(), throttle(350))) {
    console.log("bundle yield", items);
  }
}

main();