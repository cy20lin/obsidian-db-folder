import { add_toggle } from "settings/SettingsComponents";
import { AbstractColumnHandler } from "components/modals/columnSettings/handlers/AbstractColumnHandler";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
export class HideCompletedTaskToggleHandler extends AbstractColumnHandler {
    settingTitle: string = 'Hide completed tasks';
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, view } = columnHandlerResponse;
        const inline_togle_promise = async (value: boolean): Promise<void> => {
            column.config.task_hide_completed = value;
            // Persist value
            await view.diskConfig.updateColumnConfig(column.key, {
                task_hide_completed: value
            });
        }
        add_toggle(
            containerEl,
            this.settingTitle,
            "Hide the completed tasks shown in the task column",
            column.config.task_hide_completed,
            inline_togle_promise
        );
        return this.goNext(columnHandlerResponse);
    }
}