import json
from collections import defaultdict, deque

class MetricEvaluator:
    def __init__(self, metrics, input_values):
        self.metrics = metrics
        self.input_values = input_values
        self.results = {}

        self.dispatch_map = {
            "threshold": self.evaluate_threshold,
            "map_rating": self.evaluate_map_rating,
            "map_score": self.evaluate_map_score,
            "max": self.evaluate_max,
            "custom": self.evaluate_custom
        }

    def evaluate_metric(self, m_id):
        metric = self.metrics[m_id]
        mtype = metric["type"]

        if mtype not in self.dispatch_map:
            raise ValueError(f"Unknown metric type: {mtype}")

        return self.dispatch_map[mtype](m_id, metric)

    def evaluate_threshold(self, m_id, metric):
        value = self.input_values[metric["dependencies"][0]]
        thresholds = metric["expression"]
        if value < thresholds[0]:
            return "Low"
        elif value < thresholds[1]:
            return "Moderate"
        elif value < thresholds[2]:
            return "High"
        else:
            return "Critical"

    def evaluate_map_rating(self, m_id, metric):
        rating = self.results[metric["dependencies"][0]]
        return metric["expression"].get(rating, 0)

    def evaluate_map_score(self, m_id, metric):
        score = self.results[metric["dependencies"][0]]
        return metric["expression"].get(str(score), "NR")

    def evaluate_max(self, m_id, metric):
        values = [self.results[dep] for dep in metric["dependencies"]]
        return max(values)

    def evaluate_custom(self, m_id, metric):
        local_vars = {dep: self.results[dep] if dep in self.results else self.input_values.get(dep) for dep in metric["dependencies"]}
        func = eval(metric["expression"])
        return func(**local_vars)

    def run_evaluation(self, eval_order):
        for m_id in eval_order:
            self.results[m_id] = self.evaluate_metric(m_id)
        return self.results

def get_eval_order(metrics):
    graph = defaultdict(list)
    indegree = defaultdict(int)

    all_metrics = set(metrics.keys())
    for metric, config in metrics.items():
        for dep in config.get("dependencies", []):
            if dep in all_metrics:
                graph[dep].append(metric)
                indegree[metric] += 1
            indegree.setdefault(dep, 0)

    queue = deque([m for m in metrics if indegree[m] == 0])
    order = []
    while queue:
        m = queue.popleft()
        order.append(m)
        for neighbor in graph[m]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    return order

# ------------------------
# Example Usage
# ------------------------
if __name__ == "__main__":
    rule_config = {
        "metrics": {
            "G1_Rating": {
                "type": "threshold",
                "dependencies": ["G1"],
                "expression": [10, 20, 30]
            },
            "G2_Rating": {
                "type": "threshold",
                "dependencies": ["G2"],
                "expression": [10, 20, 30]
            },
            "G3_Rating": {
                "type": "threshold",
                "dependencies": ["G3"],
                "expression": [10, 20, 30]
            },
            "G1_Score": {
                "type": "map_rating",
                "dependencies": ["G1_Rating"],
                "expression": {
                    "Low": 1,
                    "Moderate": 2,
                    "High": 3,
                    "Critical": 4
                }
            },
            "G2_Score": {
                "type": "map_rating",
                "dependencies": ["G2_Rating"],
                "expression": {
                    "Low": 1,
                    "Moderate": 2,
                    "High": 3,
                    "Critical": 4
                }
            },
            "G3_Score": {
                "type": "map_rating",
                "dependencies": ["G3_Rating"],
                "expression": {
                    "Low": 1,
                    "Moderate": 2,
                    "High": 3,
                    "Critical": 4
                }
            },
            "G1G2_Score": {
                "type": "max",
                "dependencies": ["G1_Score", "G2_Score"]
            },
            "G1G2_Rating": {
                "type": "map_score",
                "dependencies": ["G1G2_Score"],
                "expression": {
                    "1": "Low",
                    "2": "Moderate",
                    "3": "High",
                    "4": "Critical"
                }
            },
            "SpecialRating": {
                "type": "custom",
                "dependencies": ["G1_Rating", "G2_Rating"],
                "expression": "lambda G1_Rating, G2_Rating: 'Critical' if G1_Rating == 'Critical' or G2_Rating == 'Critical' else 'Moderate'"
            },
            "Final_Score": {
                "type": "max",
                "dependencies": ["G1G2_Score", "G3_Score"]
            },
            "Final_Rating": {
                "type": "map_score",
                "dependencies": ["Final_Score"],
                "expression": {
                    "1": "Low",
                    "2": "Moderate",
                    "3": "High",
                    "4": "Critical"
                }
            }
        }
    }

    input_values = {
        "G1": 12,
        "G2": 35,
        "G3": 28
    }

    evaluator = MetricEvaluator(rule_config["metrics"], input_values)
    order = get_eval_order(rule_config["metrics"])
    print("Evaluation Order:", order)
    result = evaluator.run_evaluation(order)

    print("\n🔍 Final Evaluation Result:")
    for k in result:
        print(f"{k}: {result[k]}")














import json
from collections import defaultdict, deque
from graphviz import Digraph

class MetricEvaluator:
    def __init__(self, metrics, input_values):
        self.metrics = metrics
        self.input_values = input_values
        self.results = {}

        self.dispatch_map = {
            "threshold": self.evaluate_threshold,
            "map_rating": self.evaluate_map_rating,
            "map_score": self.evaluate_map_score,
            "max": self.evaluate_max,
            "custom": self.evaluate_custom
        }

    def evaluate_metric(self, m_id):
        metric = self.metrics[m_id]
        mtype = metric["type"]

        if mtype not in self.dispatch_map:
            raise ValueError(f"Unknown metric type: {mtype}")

        return self.dispatch_map[mtype](m_id, metric)

    def evaluate_threshold(self, m_id, metric):
        value = self.input_values[metric["dependencies"][0]]
        thresholds = metric["expression"]
        if value < thresholds[0]:
            return "Low"
        elif value < thresholds[1]:
            return "Moderate"
        elif value < thresholds[2]:
            return "High"
        else:
            return "Critical"

    def evaluate_map_rating(self, m_id, metric):
        rating = self.results[metric["dependencies"][0]]
        return metric["expression"].get(rating, 0)

    def evaluate_map_score(self, m_id, metric):
        score = self.results[metric["dependencies"][0]]
        return metric["expression"].get(str(score), "NR")

    def evaluate_max(self, m_id, metric):
        values = [self.results[dep] for dep in metric["dependencies"]]
        return max(values)

    def evaluate_custom(self, m_id, metric):
        local_vars = {dep: self.results[dep] if dep in self.results else self.input_values.get(dep) for dep in metric["dependencies"]}
        func = eval(metric["expression"])
        return func(**local_vars)

    def run_evaluation(self, eval_order):
        for m_id in eval_order:
            self.results[m_id] = self.evaluate_metric(m_id)
        return self.results

def get_eval_order(metrics):
    graph = defaultdict(list)
    indegree = defaultdict(int)

    all_metrics = set(metrics.keys())
    for metric, config in metrics.items():
        for dep in config.get("dependencies", []):
            if dep in all_metrics:
                graph[dep].append(metric)
                indegree[metric] += 1
            indegree.setdefault(dep, 0)

    queue = deque([m for m in metrics if indegree[m] == 0])
    order = []
    while queue:
        m = queue.popleft()
        order.append(m)
        for neighbor in graph[m]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    return order

def generate_decision_tree(metrics, input_values, results):
    dot = Digraph(comment="Decision Tree")
    for metric_id, details in metrics.items():
        value = results.get(metric_id, "Pending")
        dot.node(metric_id, f"{metric_id}\n{value}", shape="box", style="filled", color="lightblue")

        for dep in details.get("dependencies", []):
            if dep in results:
                dot.edge(dep, metric_id)
            else:
                input_val = input_values.get(dep, "Unknown")
                dot.node(dep, f"{dep}\n{input_val}", shape="ellipse", color="lightgray")
                dot.edge(dep, metric_id)

    dot.render("decision_tree", format="png", cleanup=True)
    print("✅ Decision tree written to decision_tree.png")

# ------------------------
# Example Usage
# ------------------------
if __name__ == "__main__":
    rule_config = {
        "metrics": {
            "G1_Rating": {
                "type": "threshold",
                "dependencies": ["G1"],
                "expression": [10, 20, 30]
            },
            "G2_Rating": {
                "type": "threshold",
                "dependencies": ["G2"],
                "expression": [10, 20, 30]
            },
            "G3_Rating": {
                "type": "threshold",
                "dependencies": ["G3"],
                "expression": [10, 20, 30]
            },
            "G1_Score": {
                "type": "map_rating",
                "dependencies": ["G1_Rating"],
                "expression": {
                    "Low": 1,
                    "Moderate": 2,
                    "High": 3,
                    "Critical": 4
                }
            },
            "G2_Score": {
                "type": "map_rating",
                "dependencies": ["G2_Rating"],
                "expression": {
                    "Low": 1,
                    "Moderate": 2,
                    "High": 3,
                    "Critical": 4
                }
            },
            "G3_Score": {
                "type": "map_rating",
                "dependencies": ["G3_Rating"],
                "expression": {
                    "Low": 1,
                    "Moderate": 2,
                    "High": 3,
                    "Critical": 4
                }
            },
            "G1G2_Score": {
                "type": "max",
                "dependencies": ["G1_Score", "G2_Score"]
            },
            "G1G2_Rating": {
                "type": "map_score",
                "dependencies": ["G1G2_Score"],
                "expression": {
                    "1": "Low",
                    "2": "Moderate",
                    "3": "High",
                    "4": "Critical"
                }
            },
            "SpecialRating": {
                "type": "custom",
                "dependencies": ["G1_Rating", "G2_Rating"],
                "expression": "lambda G1_Rating, G2_Rating: 'Critical' if G1_Rating == 'Critical' or G2_Rating == 'Critical' else 'Moderate'"
            },
            "Final_Score": {
                "type": "max",
                "dependencies": ["G1G2_Score", "G3_Score"]
            },
            "Final_Rating": {
                "type": "map_score",
                "dependencies": ["Final_Score"],
                "expression": {
                    "1": "Low",
                    "2": "Moderate",
                    "3": "High",
                    "4": "Critical"
                }
            }
        }
    }

    input_values = {
        "G1": 12,
        "G2": 35,
        "G3": 28
    }

    evaluator = MetricEvaluator(rule_config["metrics"], input_values)
    order = get_eval_order(rule_config["metrics"])
    print("Evaluation Order:", order)
    result = evaluator.run_evaluation(order)

    print("\n🔍 Final Evaluation Result:")
    for k in result:
        print(f"{k}: {result[k]}")

    generate_decision_tree(rule_config["metrics"], input_values, result)
















# Enhanced rule configuration with Excel-like patterns
    enhanced_config = {
        "metrics": {
            # Basic thresholds
            "G1_Rating": {
                "type": "threshold",
                "dependencies": ["G1"],
                "expression": [10, 20, 30],
                "labels": ["Low", "Moderate", "High", "Critical"]
            },
            "G2_Rating": {
                "type": "threshold",
                "dependencies": ["G2"],
                "expression": [15, 25, 35],
                "labels": ["Low", "Moderate", "High", "Critical"]
            },
            "G3_Rating": {
                "type": "threshold",
                "dependencies": ["G3"],
                "expression": [10, 20, 30]
            },
            
            # Excel-like conditional patterns
            "Primary_Rating": {
                "type": "fallback",
                "dependencies": ["G1_Rating", "G2_Rating"],
                "expression": {
                    "na_values": ["N/A", None, ""]
                }
            },
            
            "Backup_Rating": {
                "type": "coalesce",
                "dependencies": ["G1_Rating", "G2_Rating", "G3_Rating"],
                "expression": {
                    "default": "Low"
                }
            },
            
            "Status_Based_Rating": {
                "type": "if_then_else",
                "dependencies": ["Status", "G1_Rating", "G2_Rating"],
                "expression": {
                    "condition": "Status == 'Active'",
                    "if_true": "G1_Rating",
                    "if_false": "G2_Rating"
                }
            },
            
            "Worst_Case_Rating": {
                "type": "rating_worst",
                "dependencies": ["G1_Rating", "G2_Rating", "G3_Rating"]
            },
            
            "Best_Case_Rating": {
                "type": "rating_best", 
                "dependencies": ["G1_Rating", "G2_Rating", "G3_Rating"]
            },
            
            "Priority_Rating": {
                "type": "priority_select",
                "dependencies": ["High_Priority_Rating", "Medium_Priority_Rating", "Low_Priority_Rating"],
                "expression": {
                    "default": "Low"
                }
            },
            
            "Complex_Logic_Rating": {
                "type": "conditional_rating",
                "dependencies": ["Status", "Category", "G1_Rating", "G2_Rating"],
                "expression": {
                    "rules": [
                        {"condition": "Status == 'Critical' and Category == 'A'", "return": "Critical"},
                        {"condition": "Status == 'Active'", "return": "G1_Rating"},
                        {"condition": "Category == 'B'", "return": "G2_Rating"}
                    ],
                    "default": "Low"
                }
            },
            
            # Score mappings
            "G1_Score": {
                "type": "map_rating",
                "dependencies": ["G1_Rating"],
                "expression": {
                    "Low": 1,
                    "    def evaluate_custom(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """Enhanced custom evaluation with better error handling"""
        local_vars = {}
        for dep in metric["dependencies"]:
            local_vars[dep] = self.get_dependency_value(dep)
        
        # Add mathematical functions
        local_vars.update(self.math_operators)
        local_vars.update({
            'abs': abs, 'len': len, 'str': str, 'int': int, 'float': float
        })
        
        try:
            if isinstance(metric["expression"], str):
                # Lambda expression
                func = eval(metric["expression"], {"__builtins__": {}}, local_vars)
                return func(**{k: v for k, v in local_vars.items() if k in metric["dependencies"]})
            else:
                # Direct expression evaluation
                return eval(str(metric["expression"]), {"__builtins__": {}}, local_vars)
        except Exception asimport json
import logging
from collections import defaultdict, deque
from typing import Dict, Any, List, Union, Optional
from dataclasses import dataclass
from datetime import datetime
import operator
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class EvaluationResult:
    """Stores evaluation results with metadata"""
    value: Any
    timestamp: datetime
    dependencies_used: List[str]
    computation_time_ms: float = 0.0

class EnhancedMetricEvaluator:
    """
    Enhanced rule-based metric evaluation system for impact analysis
    
    Features:
    - Multiple evaluation strategies
    - Dependency tracking and validation
    - Impact analysis (what-if scenarios)
    - Detailed logging and debugging
    - Error handling and validation
    - Performance tracking
    """
    
    def __init__(self, metrics: Dict[str, Any], input_values: Dict[str, Any], 
                 debug: bool = False):
        self.metrics = metrics
        self.input_values = input_values
        self.results: Dict[str, EvaluationResult] = {}
        self.debug = debug
        
        # Enhanced dispatch map with more operators
        self.dispatch_map = {
            "threshold": self.evaluate_threshold,
            "map_rating": self.evaluate_map_rating,
            "map_score": self.evaluate_map_score,
            "max": self.evaluate_max,
            "min": self.evaluate_min,
            "avg": self.evaluate_avg,
            "sum": self.evaluate_sum,
            "custom": self.evaluate_custom,
            "conditional": self.evaluate_conditional,
            "weighted_sum": self.evaluate_weighted_sum,
            "percentage": self.evaluate_percentage,
            "lookup": self.evaluate_lookup,
            # New Excel-like conditional patterns
            "fallback": self.evaluate_fallback,
            "worst_of": self.evaluate_worst_of,
            "best_of": self.evaluate_best_of,
            "if_then_else": self.evaluate_if_then_else,
            "coalesce": self.evaluate_coalesce,
            "priority_select": self.evaluate_priority_select,
            "rating_worst": self.evaluate_rating_worst,
            "rating_best": self.evaluate_rating_best,
            "conditional_rating": self.evaluate_conditional_rating
        }
        
        # Mathematical operators
        self.math_operators = {
            '+': operator.add,
            '-': operator.sub,
            '*': operator.mul,
            '/': operator.truediv,
            '//': operator.floordiv,
            '%': operator.mod,
            '**': operator.pow,
            'max': max,
            'min': min,
            'abs': abs,
            'round': round
        }
        
        self._validate_configuration()

    def _validate_configuration(self):
        """Validate the metric configuration"""
        errors = []
        
        for metric_id, config in self.metrics.items():
            # Check required fields
            if "type" not in config:
                errors.append(f"Metric {metric_id}: Missing 'type' field")
            elif config["type"] not in self.dispatch_map:
                errors.append(f"Metric {metric_id}: Unknown type '{config['type']}'")
            
            # Check dependencies exist
            dependencies = config.get("dependencies", [])
            for dep in dependencies:
                if dep not in self.metrics and dep not in self.input_values:
                    errors.append(f"Metric {metric_id}: Unknown dependency '{dep}'")
        
        if errors:
            raise ValueError("Configuration validation failed:\n" + "\n".join(errors))

    def get_dependency_value(self, dep_id: str) -> Any:
        """Get value from either results or input values"""
        if dep_id in self.results:
            return self.results[dep_id].value
        elif dep_id in self.input_values:
            return self.input_values[dep_id]
        else:
            raise ValueError(f"Dependency '{dep_id}' not found in results or inputs")

    def evaluate_threshold(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """Enhanced threshold evaluation with customizable labels"""
        value = self.get_dependency_value(metric["dependencies"][0])
        thresholds = metric["expression"]
        labels = metric.get("labels", ["Low", "Moderate", "High", "Critical"])
        
        if not isinstance(thresholds, list) or len(thresholds) < 1:
            raise ValueError(f"Metric {m_id}: Invalid thresholds format")
        
        # Handle different threshold configurations
        if len(thresholds) == 3:  # Standard 4-level threshold
            if value < thresholds[0]:
                return labels[0]
            elif value < thresholds[1]:
                return labels[1]
            elif value < thresholds[2]:
                return labels[2]
            else:
                return labels[3]
        else:  # Custom threshold levels
            for i, threshold in enumerate(thresholds):
                if value < threshold:
                    return labels[i] if i < len(labels) else f"Level_{i}"
            return labels[-1] if labels else f"Level_{len(thresholds)}"

    def evaluate_map_rating(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """Map rating to score with default value support"""
        rating = self.get_dependency_value(metric["dependencies"][0])
        mapping = metric["expression"]
        default_value = metric.get("default", 0)
        return mapping.get(rating, default_value)

    def evaluate_map_score(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """Map score to rating with default value support"""
        score = self.get_dependency_value(metric["dependencies"][0])
        mapping = metric["expression"]
        default_value = metric.get("default", "NR")
        return mapping.get(str(score), default_value)

    def evaluate_max(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """Get maximum value from dependencies"""
        values = [self.get_dependency_value(dep) for dep in metric["dependencies"]]
        # Filter out non-numeric values if specified
        if metric.get("numeric_only", False):
            values = [v for v in values if isinstance(v, (int, float))]
        return max(values) if values else None

    def evaluate_min(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """Get minimum value from dependencies"""
        values = [self.get_dependency_value(dep) for dep in metric["dependencies"]]
        if metric.get("numeric_only", False):
            values = [v for v in values if isinstance(v, (int, float))]
        return min(values) if values else None

    def evaluate_avg(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """Calculate average of dependencies"""
        values = [self.get_dependency_value(dep) for dep in metric["dependencies"]]
        numeric_values = [v for v in values if isinstance(v, (int, float))]
        if not numeric_values:
            return 0
        result = sum(numeric_values) / len(numeric_values)
        return round(result, metric.get("precision", 2))

    def evaluate_sum(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """Calculate sum of dependencies"""
        values = [self.get_dependency_value(dep) for dep in metric["dependencies"]]
        numeric_values = [v for v in values if isinstance(v, (int, float))]
        return sum(numeric_values)

    def evaluate_weighted_sum(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """Calculate weighted sum of dependencies"""
        dependencies = metric["dependencies"]
        weights = metric["expression"]["weights"]
        
        if len(dependencies) != len(weights):
            raise ValueError(f"Metric {m_id}: Number of dependencies must match number of weights")
        
        total = sum(self.get_dependency_value(dep) * weight 
                   for dep, weight in zip(dependencies, weights))
        return round(total, metric.get("precision", 2))

    def evaluate_percentage(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """Calculate percentage"""
        numerator = self.get_dependency_value(metric["dependencies"][0])
        denominator = self.get_dependency_value(metric["dependencies"][1])
        
        if denominator == 0:
            return 0
        
        percentage = (numerator / denominator) * 100
        return round(percentage, metric.get("precision", 1))

    def evaluate_conditional(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """Enhanced conditional evaluation with multiple conditions"""
        conditions = metric["expression"]["conditions"]
        default_value = metric["expression"].get("default", None)
        
        for condition in conditions:
            condition_result = self._evaluate_condition(condition["if"], metric["dependencies"])
            if condition_result:
                return condition["then"]
        
        return default_value

    def _evaluate_condition(self, condition_expr: str, dependencies: List[str]) -> bool:
        """Evaluate a condition expression safely"""
        # Create safe local variables for evaluation
        local_vars = {}
        for dep in dependencies:
            local_vars[dep] = self.get_dependency_value(dep)
        
        # Add safe functions
        local_vars.update({
            'abs': abs, 'max': max, 'min': min, 'len': len,
            'str': str, 'int': int, 'float': float, 'bool': bool
        })
        
        try:
            # Use eval with restricted globals for safety
            return bool(eval(condition_expr, {"__builtins__": {}}, local_vars))
        except Exception as e:
            logger.error(f"Error evaluating condition '{condition_expr}': {e}")
            return False

    def evaluate_lookup(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """Lookup value from a table/mapping"""
        lookup_key = self.get_dependency_value(metric["dependencies"][0])
        lookup_table = metric["expression"]["table"]
        default_value = metric.get("default", None)
        
        return lookup_table.get(str(lookup_key), default_value)

    def evaluate_custom(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """Enhanced custom evaluation with better error handling"""
        local_vars = {}
        for dep in metric["dependencies"]:
            local_vars[dep] = self.get_dependency_value(dep)
        
        # Add mathematical functions
        local_vars.update(self.math_operators)
        local_vars.update({
            'abs': abs, 'len': len, 'str': str, 'int': int, 'float': float
        })
        
        try:
            if isinstance(metric["expression"], str):
                # Lambda expression
                func = eval(metric["expression"], {"__builtins__": {}}, local_vars)
                return func(**{k: v for k, v in local_vars.items() if k in metric["dependencies"]})
            else:
                # Direct expression evaluation
                return eval(str(metric["expression"]), {"__builtins__": {}}, local_vars)
    def evaluate_custom(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """Enhanced custom evaluation with better error handling"""
        local_vars = {}
        for dep in metric["dependencies"]:
            local_vars[dep] = self.get_dependency_value(dep)
        
        # Add mathematical functions
        local_vars.update(self.math_operators)
        local_vars.update({
            'abs': abs, 'len': len, 'str': str, 'int': int, 'float': float
        })
        
        try:
            if isinstance(metric["expression"], str):
                # Lambda expression
                func = eval(metric["expression"], {"__builtins__": {}}, local_vars)
                return func(**{k: v for k, v in local_vars.items() if k in metric["dependencies"]})
            else:
                # Direct expression evaluation
                return eval(str(metric["expression"]), {"__builtins__": {}}, local_vars)
        except Exception as e:
            logger.error(f"Error in custom metric {m_id}: {e}")
            raise ValueError(f"Custom metric evaluation failed for {m_id}: {e}")

    # =================================================================
    # EXCEL-LIKE CONDITIONAL PATTERNS
    # =================================================================
    
    def evaluate_fallback(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """
        Fallback logic: if primary is N/A/None/empty, use secondary
        Pattern: IF(G1="N/A", G2, G1) or IF(ISNA(G1), G2, G1)
        
        Config example:
        {
            "type": "fallback",
            "dependencies": ["G1", "G2"],
            "expression": {
                "na_values": ["N/A", None, "", "NULL"]  # Optional, defaults to ["N/A", None, ""]
            }
        }
        """
        primary_val = self.get_dependency_value(metric["dependencies"][0])
        fallback_val = self.get_dependency_value(metric["dependencies"][1])
        
        na_values = metric.get("expression", {}).get("na_values", ["N/A", None, ""])
        
        return fallback_val if primary_val in na_values else primary_val

    def evaluate_coalesce(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """
        Return first non-N/A value from multiple dependencies
        Pattern: COALESCE(G1, G2, G3, "Default")
        
        Config example:
        {
            "type": "coalesce",
            "dependencies": ["G1", "G2", "G3"],
            "expression": {
                "na_values": ["N/A", None, ""],
                "default": "No Value"  # Optional default if all are N/A
            }
        }
        """
        na_values = metric.get("expression", {}).get("na_values", ["N/A", None, ""])
        default_value = metric.get("expression", {}).get("default", "N/A")
        
        for dep in metric["dependencies"]:
            value = self.get_dependency_value(dep)
            if value not in na_values:
                return value
        
        return default_value

    def evaluate_if_then_else(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """
        Simple if-then-else logic
        Pattern: IF(condition, value_if_true, value_if_false)
        
        Config example:
        {
            "type": "if_then_else",
            "dependencies": ["metric1", "metric2"],
            "expression": {
                "condition": "metric1 == 'Yes'",
                "if_true": "metric1_rating",  # Can be dependency name or literal value
                "if_false": "metric2_rating"
            }
        }
        """
        condition_expr = metric["expression"]["condition"]
        if_true = metric["expression"]["if_true"]
        if_false = metric["expression"]["if_false"]
        
        # Evaluate condition
        condition_result = self._evaluate_condition(condition_expr, metric["dependencies"])
        
        # Return appropriate value (could be dependency or literal)
        selected_value = if_true if condition_result else if_false
        
        # Check if it's a dependency name or literal value
        try:
            return self.get_dependency_value(selected_value)
        except ValueError:
            # It's a literal value
            return selected_value

    def evaluate_worst_of(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """
        Return the worst (highest risk) rating from multiple dependencies
        Pattern: Take worst case scenario from multiple ratings
        
        Config example:
        {
            "type": "worst_of",
            "dependencies": ["rating1", "rating2", "rating3"],
            "expression": {
                "rating_order": ["Low", "Moderate", "High", "Critical"],  # Worst to best
                "exclude_na": true  # Optional: ignore N/A values
            }
        }
        """
        rating_order = metric["expression"]["rating_order"]
        exclude_na = metric.get("expression", {}).get("exclude_na", True)
        na_values = ["N/A", None, ""]
        
        values = []
        for dep in metric["dependencies"]:
            val = self.get_dependency_value(dep)
            if exclude_na and val in na_values:
                continue
            values.append(val)
        
        if not values:
            return "N/A"
        
        # Find the worst rating (highest index in rating_order)
        worst_index = -1
        worst_value = values[0]
        
        for val in values:
            try:
                val_index = rating_order.index(val)
                if val_index > worst_index:
                    worst_index = val_index
                    worst_value = val
            except ValueError:
                # Value not in rating order, skip or handle
                continue
        
        return worst_value

    def evaluate_best_of(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """
        Return the best (lowest risk) rating from multiple dependencies
        Pattern: Take best case scenario from multiple ratings
        """
        rating_order = metric["expression"]["rating_order"]
        exclude_na = metric.get("expression", {}).get("exclude_na", True)
        na_values = ["N/A", None, ""]
        
        values = []
        for dep in metric["dependencies"]:
            val = self.get_dependency_value(dep)
            if exclude_na and val in na_values:
                continue
            values.append(val)
        
        if not values:
            return "N/A"
        
        # Find the best rating (lowest index in rating_order)
        best_index = len(rating_order)
        best_value = values[0]
        
        for val in values:
            try:
                val_index = rating_order.index(val)
                if val_index < best_index:
                    best_index = val_index
                    best_value = val
            except ValueError:
                continue
        
        return best_value

    def evaluate_rating_worst(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """
        Specialized worst-of for standard rating scales (Low/Moderate/High/Critical)
        
        Config example:
        {
            "type": "rating_worst",
            "dependencies": ["G1_Rating", "G2_Rating", "G3_Rating"]
        }
        """
        standard_order = ["Low", "Moderate", "High", "Critical"]
        values = [self.get_dependency_value(dep) for dep in metric["dependencies"]]
        
        # Filter out N/A values
        valid_values = [v for v in values if v not in ["N/A", None, ""]]
        
        if not valid_values:
            return "N/A"
        
        worst_index = -1
        worst_value = valid_values[0]
        
        for val in valid_values:
            try:
                val_index = standard_order.index(val)
                if val_index > worst_index:
                    worst_index = val_index
                    worst_value = val
            except ValueError:
                continue
        
        return worst_value

    def evaluate_rating_best(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """
        Specialized best-of for standard rating scales (Low/Moderate/High/Critical)
        """
        standard_order = ["Low", "Moderate", "High", "Critical"]
        values = [self.get_dependency_value(dep) for dep in metric["dependencies"]]
        
        # Filter out N/A values
        valid_values = [v for v in values if v not in ["N/A", None, ""]]
        
        if not valid_values:
            return "N/A"
        
        best_index = len(standard_order)
        best_value = valid_values[0]
        
        for val in valid_values:
            try:
                val_index = standard_order.index(val)
                if val_index < best_index:
                    best_index = val_index
                    best_value = val
            except ValueError:
                continue
        
        return best_value

    def evaluate_priority_select(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """
        Select value based on priority order of dependencies
        Pattern: Use first available (non-N/A) value in priority order
        
        Config example:
        {
            "type": "priority_select",
            "dependencies": ["high_priority", "medium_priority", "low_priority"],
            "expression": {
                "na_values": ["N/A", None, ""],
                "default": "No Data"
            }
        }
        """
        na_values = metric.get("expression", {}).get("na_values", ["N/A", None, ""])
        default_value = metric.get("expression", {}).get("default", "N/A")
        
        # Return first non-N/A value in dependency order (priority order)
        for dep in metric["dependencies"]:
            value = self.get_dependency_value(dep)
            if value not in na_values:
                return value
        
        return default_value

    def evaluate_conditional_rating(self, m_id: str, metric: Dict[str, Any]) -> Any:
        """
        Complex conditional logic for ratings based on multiple criteria
        Pattern: IF(metric1="Yes", use metric1_rating, ELSE IF(metric2="High", use metric2_rating, ELSE use default))
        
        Config example:
        {
            "type": "conditional_rating",
            "dependencies": ["status1", "status2", "rating1", "rating2"],
            "expression": {
                "rules": [
                    {"condition": "status1 == 'Yes'", "return": "rating1"},
                    {"condition": "status2 == 'High'", "return": "rating2"},
                    {"condition": "status1 == 'Maybe' and status2 != 'Low'", "return": "Moderate"}
                ],
                "default": "Low"
            }
        }
        """
        rules = metric["expression"]["rules"]
        default_value = metric["expression"].get("default", "N/A")
        
        for rule in rules:
            condition_result = self._evaluate_condition(rule["condition"], metric["dependencies"])
            if condition_result:
                return_value = rule["return"]
                # Check if return value is a dependency or literal
                try:
                    return self.get_dependency_value(return_value)
                except ValueError:
                    return return_value
        
        return default_value

    def evaluate_metric(self, m_id: str) -> EvaluationResult:
        """Evaluate a single metric with timing and dependency tracking"""
        start_time = datetime.now()
        
        metric = self.metrics[m_id]
        mtype = metric["type"]
        dependencies_used = metric.get("dependencies", [])
        
        if self.debug:
            logger.info(f"Evaluating metric: {m_id} (type: {mtype})")
        
        try:
            value = self.dispatch_map[mtype](m_id, metric)
            end_time = datetime.now()
            computation_time = (end_time - start_time).total_seconds() * 1000
            
            result = EvaluationResult(
                value=value,
                timestamp=end_time,
                dependencies_used=dependencies_used,
                computation_time_ms=computation_time
            )
            
            if self.debug:
                logger.info(f"✓ {m_id} = {value} (computed in {computation_time:.2f}ms)")
            
            return result
            
        except Exception as e:
            logger.error(f"Error evaluating metric {m_id}: {e}")
            raise

    def run_evaluation(self, eval_order: Optional[List[str]] = None) -> Dict[str, Any]:
        """Run complete evaluation with optional custom order"""
        if eval_order is None:
            eval_order = get_eval_order(self.metrics)
        
        if self.debug:
            logger.info(f"Evaluation order: {eval_order}")
        
        start_time = datetime.now()
        
        for m_id in eval_order:
            self.results[m_id] = self.evaluate_metric(m_id)
        
        total_time = (datetime.now() - start_time).total_seconds() * 1000
        
        if self.debug:
            logger.info(f"Total evaluation completed in {total_time:.2f}ms")
        
        # Return simple dict for backward compatibility
        return {k: v.value for k, v in self.results.items()}

    def impact_analysis(self, changes: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
        """
        Perform impact analysis by changing input values and comparing results
        
        Args:
            changes: Dictionary of input value changes {input_key: new_value}
        
        Returns:
            Dictionary showing before/after values and affected metrics
        """
        # Store original values
        original_inputs = self.input_values.copy()
        original_results = self.run_evaluation()
        
        # Apply changes
        self.input_values.update(changes)
        self.results.clear()  # Clear cached results
        
        # Get new results
        new_results = self.run_evaluation()
        
        # Compare results
        impact_report = {
            "changes_applied": changes,
            "affected_metrics": {},
            "summary": {
                "total_metrics": len(self.metrics),
                "affected_count": 0,
                "unchanged_count": 0
            }
        }
        
        for metric_id in self.metrics:
            old_value = original_results.get(metric_id)
            new_value = new_results.get(metric_id)
            
            if old_value != new_value:
                impact_report["affected_metrics"][metric_id] = {
                    "old_value": old_value,
                    "new_value": new_value,
                    "changed": True
                }
                impact_report["summary"]["affected_count"] += 1
            else:
                impact_report["summary"]["unchanged_count"] += 1
        
        # Restore original values
        self.input_values = original_inputs
        self.results.clear()
        
        return impact_report

    def get_metric_dependencies(self, metric_id: str) -> List[str]:
        """Get all dependencies (direct and indirect) for a metric"""
        visited = set()
        dependencies = []
        
        def dfs(m_id):
            if m_id in visited:
                return
            visited.add(m_id)
            
            if m_id in self.metrics:
                for dep in self.metrics[m_id].get("dependencies", []):
                    dependencies.append(dep)
                    dfs(dep)
        
        dfs(metric_id)
        return list(set(dependencies))

    def export_results(self, format_type: str = "json") -> str:
        """Export results in various formats"""
        if format_type == "json":
            export_data = {
                "input_values": self.input_values,
                "results": {k: v.value for k, v in self.results.items()},
                "metadata": {
                    "evaluation_timestamp": datetime.now().isoformat(),
                    "total_metrics": len(self.metrics)
                }
            }
            return json.dumps(export_data, indent=2, default=str)
        else:
            raise ValueError(f"Unsupported export format: {format_type}")


def get_eval_order(metrics: Dict[str, Any]) -> List[str]:
    """
    Enhanced topological sort with cycle detection
    """
    graph = defaultdict(list)
    indegree = defaultdict(int)
    
    all_metrics = set(metrics.keys())
    
    # Build dependency graph
    for metric, config in metrics.items():
        indegree[metric] = 0  # Initialize
        
    for metric, config in metrics.items():
        for dep in config.get("dependencies", []):
            if dep in all_metrics:  # Only consider metric dependencies
                graph[dep].append(metric)
                indegree[metric] += 1
    
    # Topological sort
    queue = deque([m for m in metrics if indegree[m] == 0])
    order = []
    
    while queue:
        current = queue.popleft()
        order.append(current)
        
        for neighbor in graph[current]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    
    # Check for cycles
    if len(order) != len(metrics):
        remaining = set(metrics.keys()) - set(order)
        raise ValueError(f"Circular dependency detected among metrics: {remaining}")
    
    return order


# ------------------------
# Example Usage with Enhanced Features
# ------------------------
if __name__ == "__main__":
    # Enhanced rule configuration
    # Enhanced rule configuration with Excel-like patterns
    enhanced_config = {
        "metrics": {
            # Basic thresholds
            "G1_Rating": {
                "type": "threshold",
                "dependencies": ["G1"],
                "expression": [10, 20, 30],
                "labels": ["Low", "Moderate", "High", "Critical"]
            },
            "G2_Rating": {
                "type": "threshold",
                "dependencies": ["G2"],
                "expression": [15, 25, 35],
                "labels": ["Low", "Moderate", "High", "Critical"]
            },
            "G3_Rating": {
                "type": "threshold",
                "dependencies": ["G3"],
                "expression": [10, 20, 30]
            },
            
            # Excel-like conditional patterns - Common business logic
            "Primary_Rating": {
                "type": "fallback",
                "dependencies": ["G1_Rating", "G2_Rating"],
                "expression": {
                    "na_values": ["N/A", None, ""]
                }
            },
            
            "Backup_Rating": {
                "type": "coalesce",
                "dependencies": ["G1_Rating", "G2_Rating", "G3_Rating"],
                "expression": {
                    "default": "Low"
                }
            },
            
            "Status_Based_Rating": {
                "type": "if_then_else",
                "dependencies": ["Status", "G1_Rating", "G2_Rating"],
                "expression": {
                    "condition": "Status == 'Active'",
                    "if_true": "G1_Rating",
                    "if_false": "G2_Rating"
                }
            },
            
            "Worst_Case_Rating": {
                "type": "rating_worst",
                "dependencies": ["G1_Rating", "G2_Rating", "G3_Rating"]
            },
            
            "Best_Case_Rating": {
                "type": "rating_best", 
                "dependencies": ["G1_Rating", "G2_Rating", "G3_Rating"]
            },
            
            "Priority_Rating": {
                "type": "priority_select",
                "dependencies": ["High_Priority_Rating", "Medium_Priority_Rating", "Low_Priority_Rating"],
                "expression": {
                    "default": "Low"
                }
            },
            
            "Complex_Logic_Rating": {
                "type": "conditional_rating",
                "dependencies": ["Status", "Category", "G1_Rating", "G2_Rating"],
                "expression": {
                    "rules": [
                        {"condition": "Status == 'Critical' and Category == 'A'", "return": "Critical"},
                        {"condition": "Status == 'Active'", "return": "G1_Rating"},
                        {"condition": "Category == 'B'", "return": "G2_Rating"}
                    ],
                    "default": "Low"
                }
            },
            
            # Score mappings
            "G1_Score": {
                "type": "map_rating",
                "dependencies": ["G1_Rating"],
                "expression": {
                    "Low": 1,
                    "Moderate": 2,
                    "High": 3,
                    "Critical": 4
                }
            },
            "G2_Score": {
                "type": "map_rating",
                "dependencies": ["G2_Rating"],
                "expression": {
                    "Low": 1,
                    "Moderate": 2,
                    "High": 3,
                    "Critical": 4
                }
            },
            "G3_Score": {
                "type": "map_rating",
                "dependencies": ["G3_Rating"],
                "expression": {
                    "Low": 1,
                    "Moderate": 2,
                    "High": 3,
                    "Critical": 4
                }
            },
            
            # Mathematical operations
            "Average_Score": {
                "type": "avg",
                "dependencies": ["G1_Score", "G2_Score", "G3_Score"],
                "precision": 1
            },
            "Weighted_Risk": {
                "type": "weighted_sum",
                "dependencies": ["G1_Score", "G2_Score", "G3_Score"],
                "expression": {
                    "weights": [0.4, 0.35, 0.25]
                },
                "precision": 2
            },
            
            # Final determinations
            "Risk_Level": {
                "type": "conditional",
                "dependencies": ["Weighted_Risk", "G1_Score"],
                "expression": {
                    "conditions": [
                        {"if": "Weighted_Risk >= 3.5", "then": "Critical"},
                        {"if": "Weighted_Risk >= 2.5", "then": "High"},
                        {"if": "Weighted_Risk >= 1.5", "then": "Moderate"}
                    ],
                    "default": "Low"
                }
            },
            "Final_Score": {
                "type": "max",
                "dependencies": ["G1_Score", "G2_Score", "G3_Score"]
            },
            "Final_Rating": {
                "type": "map_score",
                "dependencies": ["Final_Score"],
                "expression": {
                    "1": "Low",
                    "2": "Moderate", 
                    "3": "High",
                    "4": "Critical"
                }
            }
        }
    }
    
    # Sample input with additional fields for testing conditional logic
    input_values = {
        "G1": 12,
        "G2": 35,
        "G3": 28,
        "Status": "Active",
        "Category": "A",
        "High_Priority_Rating": "N/A",
        "Medium_Priority_Rating": "High",
        "Low_Priority_Rating": "Moderate"
    }
    
    # Create enhanced evaluator
    evaluator = EnhancedMetricEvaluator(
        enhanced_config["metrics"], 
        input_values, 
        debug=True
    )
    
    # Run evaluation
    print("=" * 60)
    print("🔍 ENHANCED METRIC EVALUATION")
    print("=" * 60)
    
    result = evaluator.run_evaluation()
    
    print(f"\n📊 Final Results:")
    print("-" * 40)
    for k, v in result.items():
        print(f"{k:15}: {v}")
    
    print(f"\n🎯 EXCEL-LIKE CONDITIONAL PATTERNS DEMO")
    print("=" * 60)
    
    # Demo the new conditional patterns
    conditional_results = {
        "Primary_Rating": result.get("Primary_Rating", "N/A"),
        "Backup_Rating": result.get("Backup_Rating", "N/A"), 
        "Status_Based_Rating": result.get("Status_Based_Rating", "N/A"),
        "Worst_Case_Rating": result.get("Worst_Case_Rating", "N/A"),
        "Best_Case_Rating": result.get("Best_Case_Rating", "N/A"),
        "Priority_Rating": result.get("Priority_Rating", "N/A"),
        "Complex_Logic_Rating": result.get("Complex_Logic_Rating", "N/A")
    }
    
    print("📋 Conditional Logic Results:")
    print("-" * 40)
    for pattern, value in conditional_results.items():
        print(f"{pattern:20}: {value}")
    
    print(f"\n📖 Pattern Explanations:")
    print("-" * 40)
    print("• Primary_Rating    : G1_Rating if not N/A, else G2_Rating")
    print("• Backup_Rating     : First non-N/A from G1, G2, G3 ratings")
    print("• Status_Based      : G1_Rating if Status='Active', else G2_Rating")
    print("• Worst_Case        : Highest severity among all ratings")
    print("• Best_Case         : Lowest severity among all ratings")
    print("• Priority_Rating   : First available from priority order")
    print("• Complex_Logic     : Multi-condition business rules")
    
    impact = evaluator.impact_analysis({"G1": 35, "G2": 45})
    
    print(f"Changes Applied: {impact['changes_applied']}")
    print(f"Affected Metrics: {impact['summary']['affected_count']}")
    print(f"Unchanged Metrics: {impact['summary']['unchanged_count']}")
    
    print(f"\n📈 Affected Metrics:")
    print("-" * 40)
    for metric, change in impact["affected_metrics"].items():
        if change["changed"]:
            print(f"{metric:15}: {change['old_value']} → {change['new_value']}")
    
    # Export results
    print(f"\n💾 Export Results (JSON):")
    print("-" * 40)
    print(evaluator.export_results("json"))
