var RequestPromise = require("request-promise");

var chai = require('chai');
chai.should();

var sinon = require('sinon')

var Test = {
    do: function(thing){ return "no"}
}

describe('sinon', function(){
    it('should stub a method', function(){
        //console.log(RequestPromise.Request.prototype.init);
        //for(var prop in RequestPromise.Request.prototype.init){
        //    console.log(prop);
        //}
        sinon.stub(RequestPromise.Request.prototype, 'init', function(args) {
            //console.log('I am being f*king executed...' + args);
            return 'mangos';
        });
        console.log("printing result : ", RequestPromise({hi : 'test'}).hi);
        //var ModuleBase = require('../module-base');
        //var moduleBase = new ModuleBase();
        //moduleBase.requestPromise('http://localhost', '/a', 'b', 'c');
        //Test.do("thing").should.equal("no")
        //moduleBase.printMyName();
        //sinon.stub(Test, "do", function(){return "yes"})
        //Test.do("thing").should.equal("yes")
        //
        //Test.do.restore()
        //Test.do("thing").should.equal("no")
    })

    it('should validate if a function is called', function(){
        sinon.stub(Test, "do", function(){return "yes"})

        Test.do.calledOnce.should.be.false

        Test.do("thing").should.equal("yes")
        Test.do.calledOnce.should.be.true

        Test.do.restore()
    })

    it('should validate a functions parameters', function(){
        sinon.stub(Test, "do", function(thing){
            thing.should.equal("thing")
            return "yes"
        })

        Test.do("thing").should.equal("yes")
        Test.do.calledOnce.should.be.true

        Test.do.restore()
    })
})