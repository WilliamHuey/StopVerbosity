describe("stop verbosity plugin for textarea", function () {
  //Create a test area div
  var $textarea,
    $testingArea,
    $generatedIndicator,
    simulateKeys,
    asynSimKeys;
  limit = 10;
  
  beforeEach(function () {
    //Make a testing div within body with existing p element
    $('body').append('<div id="testing-area"><p id="existing"></p><textarea></textarea></div>');
    //Reference the testing div and the textarea elements
    $existingIndicator = $('#existing');
    $testingArea = $('#testing-area');
    $textarea = $('#testing-area > textarea');
    simulateKeys = function (testStr) {
      $textarea.simulate("key-sequence", {
        sequence: testStr
      });
    }
    asynSimKeys = function (testStr) {
      runs(function () {
        simulateKeys(testStr);
        $textarea.trigger('input');
      });
    }
    getIndicatorAfterSimKeys = function (testStr) {
      asynSimKeys(testStr);
      return $textarea.next();
    }
  });
  
  describe("when initialized", function () {
    it("should have empty length for textarea", function () {
      expect($textarea).toBeEmpty();
      $testingArea.remove();
    });
  });
  
  describe("with plugin defaults", function () {
  
    var testStr;
    
    beforeEach(function () {
      //Using default plugin 
      $textarea.stopVerbosity({});
      $generatedIndicator = $textarea.next();
      testStr = "stuff";
    });
    
    afterEach(function () {
      $testingArea.remove();
    });
    
    it("should allow text input", function () {
      simulateKeys(testStr);
      expect($textarea.val()).toMatch(testStr);
    });
    
    it("should have limit of 10 characters", function () {
      asynSimKeys('12345678910');
      waitsFor(function () {
        return $textarea.val().length === 10;
      }, "text truncation never happened", 2000);
    });
    
    it("should have 'after' indicator position", function () {
      //Only one indicator after textarea
      expect($generatedIndicator.length).toEqual(1);
    });
    
    it("should have no id attribute present", function () {
      expect($textarea).not.toHaveAttr("id");
    });
    
    it("should have 'p' element type for indicator", function () {
      expect($generatedIndicator).toBe('p');
    });
    
    it("should have indicator phrase content", function () {
      expect($generatedIndicator.text().length).toBeGreaterThan(0);
    });
    
    it("should not use existing indicator", function () {
      //Previous p should still have zero length if not used
      expect($textarea.prev().text().length).toEqual(0);
    });
    
    it("should not emit text length change event", function () {
      var hasTriggered = false;
      $textarea.on('sv-textLengthChange', function () {
        hasTriggered = true
      });
      asynSimKeys(testStr);      
      expect(hasTriggered).toBe(false);
    });
    
    it("should have maxlength attribute when supported", function () {
      var textareaElement = document.createElement('textarea');
      if ( !! ('maxLength' in textareaElement)) {
        expect($textarea).toHaveAttr("maxlength");
      }
    });
  });
  
  describe("options specifics", function () {
  
    var checkForError;
    
    beforeEach(function () {
      checkForError = function (args) {
        var errorHasThrown = false;
        try {
          $textarea.stopVerbosity(args);
        } catch (e) {
          errorHasThrown = true;
        } finally {
          return errorHasThrown;
        }
      };
    });
    
    afterEach(function () {
      $('#testing-area').remove();
    });
    
    describe("for limit", function () {
    
      it("should throw error when zero", function () {
        expect(checkForError({
          limit: 0
        })).toBe(true);
      });
      
      it("should throw error when negative", function () {
        expect(checkForError({
          limit: -10
        })).toBe(true);
      });
      
      it("should throw error when is a decimal", function () {
        expect(checkForError({
          limit: 1.5
        })).toBe(true);
      });
      
      it("should not throw error when in scientific notation", function () {
        expect(checkForError({
          limit: 1e10
        })).toBe(false);
      });
    });
    
    describe("for indicator position", function () {
      it("should be before textarea when specified with 'before'", function () {
        $textarea.stopVerbosity({
          indicatorPosition: 'before'
        });
        expect($textarea.prev().text().length).toBeGreaterThan(0);
      });
    });
    
    describe("for indicator element type", function () {
      it("should have span element when specified with 'span'", function () {
        $textarea.stopVerbosity({
          indicatorElementType: 'span'
        });
        expect($textarea.next()).toBe('span');
      });
    });
    
    describe("for generate indicator", function () {
      it("should not be generated when set to false", function () {
        $textarea.stopVerbosity({
          generateIndicator: false
        });
        expect($textarea.next().length).toEqual(0);
      });
    });
    
    describe("for using existing indicator", function () {
      it("should reuse element for indicator", function () {
        $textarea.stopVerbosity({
          existingIndicator: $existingIndicator,
          generateIndicator: false
        });
        expect($textarea.next().length).toEqual(0);
        expect($textarea.prev().text().length).toBeGreaterThan(0);
      });
    });
    
    describe("for showing indicator", function () {
      it("should not appear when set to false", function () {
        $textarea.stopVerbosity({
          showIndicator: false
        });
        expect($textarea.next().length).toEqual(0);
      });
    });
    
    describe("for using native maxlength", function () {
      it("should not show maxlength attribute when set to false", function () {
        $textarea.stopVerbosity({
          useNativeMaxlength: false
        });
        expect($textarea).not.toHaveAttr("maxlength");
      });
    });
    
    describe("for using text length change event", function () {
        
      var testStr = "stuff";
      
      beforeEach(function () {
        $textarea.stopVerbosity({
          textLengthChange: true
        });
      });
      
      it("should emit text length change event", function () {
        var hasTriggered = false;
        $textarea.on('sv-textLengthChange', function () {
          hasTriggered = true;
        });
        simulateKeys(testStr);
        //Ie fails without timeout
        setTimeout(function () {
          expect(hasTriggered).toBe(true);
        });
      });
      
      describe("for info object", function () {
        it("should have info object within the callback", function () {
          $textarea.on('sv-textLengthChange', function (evt, infoObj) {
            expect(infoObj).toEqual(jasmine.any(Object));
          });
          simulateKeys(testStr);
        });
        
        it("should have info object's current text length corresponds to input", function () {
          $textarea.on('sv-textLengthChange', function (evt, infoObj) {
            expect(infoObj.currentTextLength).toEqual(testStr.length);
          });
          simulateKeys(testStr);
        });
        
        it("should record text input change on text addition", function () {
          $textarea.on('sv-textLengthChange', function (evt, infoObj) {
            expect(infoObj.lastTextLength).toEqual(infoObj.currentTextLength - testStr.length);
          });
          simulateKeys(testStr);
        });        
      });
    });
    
    describe("for indicator phrase", function () {
    
      var indElem;
      
      var testStr = "anything";
      
      it("should have strvar limit", function () {
        $textarea.stopVerbosity({
          indicatorPhrase: ['[limit]']
        });
        indElem = getIndicatorAfterSimKeys(testStr);
        waitsFor(function () {
          return indElem.text() === '10';
        }, "indicator did not update to reflect limit strvar", 2000);
      });
      
      it("should have strvar countdown counting down", function () {
        $textarea.stopVerbosity({
          indicatorPhrase: ['[countdown]']
        });
        indElem = getIndicatorAfterSimKeys(testStr);
        waitsFor(function () {
          return parseInt(indElem.text()) === (limit - testStr.length);
        }, "indicator did not update to reflect countdown strvar", 2000);
      });
      
      it("should have strvar countdown punctuation", function () {
        $textarea.stopVerbosity({
          indicatorPhrase: ['[countdown].']
        });
        indElem = getIndicatorAfterSimKeys(testStr);
        waitsFor(function () {
          return indElem.text().charAt(indElem.text() - 1) === '.';
        }, "indicator did not update to reflect countdown punctuation strvar", 2000);
      });
      
      it("should have strvar countup counting up", function () {
        $textarea.stopVerbosity({
          indicatorPhrase: ['[countup]']
        });
        indElem = getIndicatorAfterSimKeys(testStr);
        waitsFor(function () {
          return parseInt(indElem.text()) === testStr.length;
        }, "indicator did not update to reflect countup strvar", 2000);
      });
      
      it("should have strvar countup punctuation", function () {
        $textarea.stopVerbosity({
          indicatorPhrase: ['.[countup]']
        });
        indElem = getIndicatorAfterSimKeys(testStr);
        waitsFor(function () {
          return indElem.text().charAt(0) === '.';
        }, "indicator did not update to reflect countup punctuation strvar", 2000);
      });
    });
    
    describe("for using maxlength set to false", function () {
    
      var testStr = "other stuff here";
      
      it("should exceed the limit", function () {
        $textarea.stopVerbosity({
          useMaxlength: false
        });
        asynSimKeys(testStr);
        waitsFor(function () {
          return $textarea.val().length > limit;
        }, "indicator did not update to reflect not maxlength", 2000);
      });
      
      it("should have negative indicator for countdown", function () {
        $textarea.stopVerbosity({
          useMaxlength: false,
          indicatorPhrase: ['[countdown]']
        });
        asynSimKeys(testStr);
        waitsFor(function () {
          return parseInt($textarea.next().text()) < 0;
        }, "indicator did not update to go negative", 2000);
      });
    });
  });
});