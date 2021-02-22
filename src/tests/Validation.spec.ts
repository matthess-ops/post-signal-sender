import {Validation} from "../classes/Validation"
import {Helpers} from "../classes/Helpers"


describe('check Validation class ', () => {

   // for testing purposes put errorMessages() method to public. This way you have
    // access to the errorMessages without copying them to this test. This way
    // if the errormessages are changed in the future you dont have to change them in this test.



    const testTextGood = "Id;ClientNr;ClientName\n1;123;matthijn\n2;123;remco\n3;234;matthijn"
    const testTextIdError = "IId;ClientNr;ClientName\n1;123;matthijn\n2;123;remco\n3;234;matthijn"
    const testTextEmptyFile = ""
    const testTextDelimeterNotFound = "Id,ClientNr,ClientName\n1,123,matthijn\n2,123,remco\n3,234,matthijn"
    const testTextOnlyOneRow = "Id;ClientNr;ClientName"
    const wrongIpAdress = "273498723"
    const goodIpAdress = "http://localhost:1234/"
    const noIpAdress = ""


    test('noIpAdress should yield noIpAdress error', () => {
        const textValidation = new Validation()
        expect(textValidation.validateIpAdress(noIpAdress)).toEqual(false);
        expect(textValidation.validationErrors).toEqual([textValidation.errorMessages.noIpAdress]);

    });

    test('goodIpAdress should yield no error', () => {
        const textValidation = new Validation()
        expect(textValidation.validateIpAdress(goodIpAdress)).toEqual(true);
        expect(textValidation.validationErrors).toEqual([]);

    });


    test('wrongIpAdress should yield wrong ip adress error', () => {
        const textValidation = new Validation()
        expect(textValidation.validateIpAdress(wrongIpAdress)).toEqual(false);
        expect(textValidation.validationErrors).toEqual([textValidation.errorMessages.ipAdressIsInWrongFormat]);

    });



    test('testTextOnlyOneRow should yield testTextOnlyOneRow error', () => {
        const textValidation = new Validation()
        expect(textValidation.validateText(testTextOnlyOneRow)).toEqual(false);
        expect(textValidation.validationErrors).toEqual([textValidation.errorMessages.onlyOneRow]);

    });

 
    test('testTextGood should be true', () => {
        const textValidation = new Validation()
        expect(textValidation.validateText(testTextGood)).toEqual(true);
        expect(textValidation.validationErrors).toEqual([]);

    });
    test('testTextIdError input should yield Id error', () => {
        const textValidation = new Validation()
        expect(textValidation.validateText(testTextIdError )).toEqual(false);
        expect(textValidation.validationErrors).toEqual([textValidation.errorMessages.noIdHeader])
      });

      test('testTextEmptyFile input should yield emptyfile error', () => {
        const textValidation = new Validation()
        expect(textValidation.validateText(testTextEmptyFile )).toEqual(false);
        expect(textValidation.validationErrors).toEqual([textValidation.errorMessages.textIsEmpty])
      });
      test('testTextEmptyFile input should yield emptyfile error', () => {
        const textValidation = new Validation()
        expect(textValidation.validateText(testTextEmptyFile )).toEqual(false);
        expect(textValidation.validationErrors).toEqual([textValidation.errorMessages.textIsEmpty])
      });
      test('testTextDelimeterNotFound input should yield delimeter not found error', () => {
        const textValidation = new Validation()
        expect(textValidation.validateText(testTextDelimeterNotFound)).toEqual(false);
        expect(textValidation.validationErrors).toEqual([textValidation.errorMessages.delimeterIsNotFound])
      });



      

  });






