import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BoolAndPointsInputParam,
  TextInputWithLabelParam,
} from "@repo/types/web";
import { ActionDispatch, useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";

export function TextInputWithLabel({
  param,
  dispatch,
  type,
  disabled = false,
}: {
  param: TextInputWithLabelParam;
  dispatch: ActionDispatch<[action: any]>;
  type: string;
  disabled: boolean;
}) {
  return (
    <div className="grid grid-cols-3 w-[480px] items-center gap-3">
      <Label htmlFor={param.id} className="min-w-fit">
        {param.label}
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">{param.placeholder}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Input
        className="col-span-2"
        type={param.type}
        id={param.id}
        placeholder={param.placeholder}
        disabled={disabled}
        onChange={(e) => {
          if (!disabled) {
            switch (param.type) {
              case "email": {
                dispatch({
                  type,
                  id: param.id,
                  value: {
                    value: e.currentTarget.value,
                  },
                });
                break;
              }
              case "text": {
                dispatch({
                  type,
                  id: param.id,
                  value: {
                    value: e.currentTarget.value,
                  },
                });
                break;
              }
              case "number": {
                if (
                  param.id === "maxLeads" &&
                  Number(e.currentTarget.value) > 0 &&
                  Number(e.currentTarget.value) <= 10
                ) {
                  dispatch({
                    type,
                    id: param.id,
                    value: {
                      value: Number(e.currentTarget.value),
                    },
                  });
                } else if (param.id !== "maxLeads") {
                  dispatch({
                    type,
                    id: param.id,
                    value: {
                      value: Number(e.currentTarget.value),
                    },
                  });
                } else {
                  toast.error("Select number from 1 to 10 only! Use arrow to change value.");
                }
                break;
              }
            }
          }
        }}
        value={param.value}
      />
    </div>
  );
}

export function BoolAndPointsInput({
  param,
  dispatch,
  disabled = false,
}: {
  param: BoolAndPointsInputParam;
  dispatch: ActionDispatch<[action: any]>;
  disabled: boolean;
}) {
  return (
    <div className="flex justify-between w-[480px] items-center gap-3">
      <Label htmlFor={param.id} className="min-w-fit col-span-2">
        {param.label}
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">{param.placeholder}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <div className="flex gap-6 items-center">
        <input
          id={`${param.id}-checkbox`}
          type="checkbox"
          checked={!!param.isTrue}
          onChange={(e) => {
            if (!disabled) {
              dispatch({
                type: "boolAndPoints",
                id: param.id,
                value: {
                  isTrue: e.currentTarget.checked,
                  points: param.points,
                },
              });
            }
          }}
          className="h-4 w-4 cursor-pointer"
          aria-label={`${param.label} enabled`}
        />
        <Input
          className="max-w-24"
          type="number"
          id={param.id}
          placeholder={param.placeholder}
          onChange={(e) => {
            if (!disabled) {
              dispatch({
                type: "boolAndPoints",
                id: param.id,
                value: {
                  isTrue: param.isTrue,
                  points: Number(e.currentTarget.value),
                },
              });
            }
          }}
          disabled={!param.isTrue}
          value={param.points}
        />
      </div>
    </div>
  );
}

export function ListInput({
  param,
  dispatch,
  disabled = false,
}: {
  param: {
    id: string;
    label: string;
    placeholder?: string;
    value: string[];
  };
  dispatch: (action: any) => void;
  disabled: boolean;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (!disabled) {
      const trimmed = inputValue.trim();
      if (!trimmed) return;

      // avoid duplicates (optional)
      if (param.value.includes(trimmed)) {
        setInputValue("");
        return;
      }

      dispatch({
        type: "list",
        id: param.id,
        value: { value: [...param.value, trimmed] },
      });

      setInputValue("");
    }
  };

  const handleRemove = (country: string) => {
    if (!disabled) {
      dispatch({
        type: "list",
        id: param.id,
        value: { value: param.value.filter((c) => c !== country) },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!disabled) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAdd();
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 w-[480px]">
      <div className="grid grid-cols-2 gap-4">
        <Label htmlFor={param.id} className="min-w-fit">
          {param.label}
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">{param.placeholder}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>

        <div className="flex gap-2">
          <Input
            id={param.id}
            placeholder={param.placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
          <Button type="button" onClick={handleAdd} className="cursor-pointer">
            Add
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {param.value.map((val) => (
          <span
            key={val}
            className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm flex items-center gap-1"
          >
            {val}
            <button
              type="button"
              onClick={() => handleRemove(val)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export function DropdownInput({
  param,
  dispatch,
  type,
  data,
  currentValue,
  setCurrentValue,
  disabled = false,
}: {
  param: {
    id: string;
    label: string;
    placeholder?: string;
    options: string[];
    value: string;
  };
  dispatch: (action: any) => void;
  type: "any" | "metaData";
  data?: any;
  currentValue?: any;
  setCurrentValue?: any;
  disabled: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 w-[480px]">
      <Label htmlFor={param.id}>
        {param.label}
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">{param.placeholder}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>

      <Select
        value={param.value}
        disabled={disabled}
        onValueChange={(newValue) => {
          if (!disabled) {
            switch (type) {
              case "any":
                dispatch({
                  type: "enumsType",
                  id: param.id,
                  value: newValue,
                });
                break;

              case "metaData":
                const newState = data.find((info: any) => {
                  if (info.title === newValue) {
                    return true;
                  }
                });
                dispatch({
                  type: "update-state",
                  id: param.id,
                  value: newState,
                });
                setCurrentValue(newValue);
                break;
            }
          }
        }}
      >
        <SelectTrigger id={param.id} className="w-full">
          <SelectValue placeholder={param.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {param.options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Toaster />
    </div>
  );
}
