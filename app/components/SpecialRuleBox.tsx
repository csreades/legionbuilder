import { specialRulesData } from "../data/special_rule_data"
import { SPECIAL_RULE } from "../types/types"

// Anchor slug on epicheresy.ru, e.g. "Inspire" (valued) -> "inspire-x", "Line" -> "line".
const ruleSlug = (rule: SPECIAL_RULE) =>
	rule.name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "") + (rule.value !== undefined && rule.value !== null ? "-x" : "")

const SpecialRuleBox = ({ rule }: { rule: SPECIAL_RULE }) => {
	const description = specialRulesData.find((ruleEntry) => ruleEntry.name.toLowerCase() === rule.name.toLowerCase())
	const href = `https://epicheresy.ru/li2023/legions_imperialis_rules/special_rules/#${ruleSlug(rule)}`
	return (
		<a
			href={href}
			target="_blank"
			rel="noreferrer"
			className="cursor-pointer hover:text-primary-800 active:text-primary-800 relative group capitalize underline decoration-dotted underline-offset-2">
			{rule.name}
			{rule.value ? ` (${rule.value})` : null}
			{description && description.tooltip ? (
				<article
					id="special_rule"
					className="absolute hidden p-1 border-2 border-primary-950 bg-primary-50 group-hover:block rounded-lg w-max max-w-[200px] sm:max-w-[300px] -top-2 left-0 -translate-y-full z-20 text-primary-950 text-center normal-case">
					{description.tooltip}
					<div className="bottom-0 absolute h-0 w-0 border-x-[20px] border-x-transparent border-t-[8px] border-b-primary-50 translate-y-full left-4"></div>
				</article>
			) : null}
		</a>
	)
}

export default SpecialRuleBox
