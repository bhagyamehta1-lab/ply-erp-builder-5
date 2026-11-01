import test from 'node:test';
import assert from 'node:assert/strict';
export function batchUnitCost(components) {
 if (!Array.isArray(components)||!components.length) throw new Error('At least one cost component required');
 let total=0,quantity;
 for(const c of components){if(!Number.isFinite(c.amount)||c.amount<0||!Number.isFinite(c.outputQuantity)||c.outputQuantity<=0)throw new Error('Invalid cost component');total+=c.amount;quantity=c.outputQuantity;}
 if(components.some(c=>c.outputQuantity!==quantity)) throw new Error('Components must share the same batch output quantity');
 return total/quantity;
}
export function weightedAverageCost(existingQty,existingCost,incomingQty,incomingUnitCost) {
 if (![existingQty,existingCost,incomingQty,incomingUnitCost].every(Number.isFinite)||existingQty<0||existingCost<0||incomingQty<=0||incomingUnitCost<0) throw new Error('Invalid valuation inputs');
 const totalQty=existingQty+incomingQty;
 return {quantity:totalQty,unitCost:(existingQty*existingCost+incomingQty*incomingUnitCost)/totalQty};
}
export function yieldLossPercent(inputQty,goodOutputQty) {
 if (![inputQty,goodOutputQty].every(Number.isFinite)||inputQty<=0||goodOutputQty<0||goodOutputQty>inputQty) throw new Error('Invalid yield quantities');
 return (inputQty-goodOutputQty)/inputQty*100;
}
test('batch unit cost includes all provided cost components',()=>{
 assert.equal(batchUnitCost([{amount:800,outputQuantity:100},{amount:200,outputQuantity:100}]),10);
});
test('weighted average values incoming stock correctly',()=>{
 assert.deepEqual(weightedAverageCost(10,20,10,30),{quantity:20,unitCost:25});
});
test('yield loss rejects output greater than input',()=>{
 assert.equal(yieldLossPercent(100,90),10);
 assert.throws(()=>yieldLossPercent(100,110));
});