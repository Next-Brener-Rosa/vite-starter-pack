import { useMemo } from "react";
import type { ZodTypeAny } from "zod";
import { z } from "zod";
import { FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const unwrapSchema = (schema: ZodTypeAny): ZodTypeAny => {
	let current = schema;
	// Unwrap effects so we can inspect object shapes (refine/superRefine, etc.)
	while (current instanceof z.ZodEffects) {
		current = current.innerType();
	}
	return current;
};

const getNestedSchema = (
	schema: ZodTypeAny,
	path: string,
): ZodTypeAny | undefined => {
	const keys = path.split(".");
	let current: ZodTypeAny = unwrapSchema(schema);

	for (const key of keys) {
		current = unwrapSchema(current);
		if (current instanceof z.ZodObject) {
			current = current.shape[key];
		} else {
			return undefined;
		}

		if (!current) {
			return undefined;
		}
	}

	return current;
};

interface DynamicFormLabelProps extends React.ComponentProps<typeof FormLabel> {
	schema?: ZodTypeAny;
	fieldName?: string;
	isRequired?: boolean;
}

export function DynamicFormLabel({
	className,
	schema,
	fieldName,
	isRequired,
	children,
	...props
}: DynamicFormLabelProps) {
	const showAsterisk = useMemo(() => {
		if (isRequired === true) {
			return true;
		}

		if (isRequired === false) {
			return false;
		}

		// Auto-detect from schema if provided
		if (schema && fieldName) {
			const fieldSchema = getNestedSchema(schema, fieldName);
			if (fieldSchema) {
				return !fieldSchema.isOptional();
			}
		}

		return false;
	}, [schema, fieldName, isRequired]);

	return (
		<FormLabel
			className={cn(className)}
			{...props}
		>
			{children}
			{showAsterisk && (
				<span className="text-destructive text-xs" title="obrigatório">
					*
				</span>
			)}
		</FormLabel>
	);
}
