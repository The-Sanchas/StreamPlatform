import { NewPasswordInput } from "@/src/modules/auth/password-recovery/inputs/new-password.input";
import { ValidationArguments, ValidatorConstraint, type ValidatorConstraintInterface } from "class-validator";


@ValidatorConstraint({name: 'IsPasswordMaching', async: false})
export class IsPasswordMachingConstrain implements ValidatorConstraintInterface {

    public validate(passwordRepeat: string, args: ValidationArguments){
        
        const object = args.object as NewPasswordInput

        return object.password === passwordRepeat
    }

    public defaultMessage(validationArguments?: ValidationArguments){
        
        return 'Пароли не совпадают'
    }
}