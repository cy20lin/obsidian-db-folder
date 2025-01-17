import { FormulaFunctions } from "automations/formula_functions/FormulaFunctions";
import { IGenerateObject } from "automations/IGenerateObject";
import { LocalSettings } from "cdm/SettingsModel";
export class FormulaGenerator implements IGenerateObject {
    public js_functions: FormulaFunctions;

    constructor(private config: LocalSettings) {
        this.js_functions = new FormulaFunctions(config);
    }

    private async generate_js_functions(): Promise<Record<string, unknown>> {

        return await this.js_functions.generate_object(this.config);
    }

    async generate_object(): Promise<Record<string, unknown>> {
        const final_object: Record<string, any> = {};
        Object.assign(final_object, {
            js: await this.generate_js_functions(),
        });
        return final_object;
    }
}
