import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ColorPicker = ({ value, onChange }) => {
    const colors = [
        // כחולים
        '#2196F3', // כחול בהיר
        '#1976D2', // כחול
        '#0D47A1', // כחול כהה
        '#4FC3F7', // תכלת

        // ירוקים
        '#4CAF50', // ירוק
        '#2E7D32', // ירוק כהה
        '#81C784', // ירוק בהיר
        '#26A69A', // טורקיז

        // אדומים/כתומים
        '#F44336', // אדום
        '#D32F2F', // אדום כהה
        '#FF7043', // כתום-אדום
        '#FF5722', // כתום עמוק

        // סגולים
        '#9C27B0', // סגול
        '#7B1FA2', // סגול כהה
        '#E91E63', // ורוד-סגול
        '#6A1B9A'  // סגול עמוק
    ];

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-[140px] flex items-center justify-between gap-2 rtl"
                >
                    <div
                        className="w-4 h-4 rounded-full shadow-sm border border-zinc-200"
                        style={{ backgroundColor: value || '#ffffff' }}
                    />
                    <span className="flex-1 text-right">בחר צבע</span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[256px] p-3"
                align="start"
            >
                <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                        <button
                            key={color}
                            className={cn(
                                "h-10 w-10 rounded-md relative",
                                "transition-all duration-100 ease-in-out",
                                "hover:scale-110 hover:shadow-lg",
                                "focus:outline-none focus:ring-2 focus:ring-zinc-400",
                                value === color && "ring-2 ring-zinc-800"
                            )}
                            style={{
                                backgroundColor: color,
                                transform: value === color ? 'scale(1.1)' : 'scale(1)'
                            }}
                            onClick={() => onChange(color)}
                        >
                            {value === color && (
                                <Check
                                    className={cn(
                                        "absolute inset-0 m-auto",
                                        "w-4 h-4 text-white",
                                        "drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]"
                                    )}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default ColorPicker;