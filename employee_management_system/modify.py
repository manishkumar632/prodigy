# import pandas as pd
# import html
# import re

# # Load the Excel file
# file_path = "qsbank.xlsx"  # Change this to your actual file path
# df = pd.read_excel(file_path)

# # Function to clean HTML from text
# def clean_html(text):
#     if isinstance(text, str):  # Ensure text is a string
#         text = html.unescape(text)  # Convert HTML entities (e.g., &gt; -> >)
#         text = re.sub(r'<.*?>', '', text)  # Remove HTML tags (e.g., <strong> -> '')
#     return text  # Return the original value if not a string

# # Apply cleaning function to all text columns
# df = df.map(clean_html)

# # Save the cleaned data back to Excel
# output_file = "cleaned_file.xlsx"
# df.to_excel(output_file, index=False)

# print(f"✅ Cleaned Excel file saved as {output_file}")




import pandas as pd
import re

# Load the Excel file (update with your actual file path)
file_path = "cleaned_file.xlsx"  # Change this
df = pd.read_excel(file_path)

# Function to format the text
def format_options(text):
    if isinstance(text, str):  # Ensure text is a string
        options = re.split(r'•', text)[1:]  # Ignore text before the first bullet
        return "\n".join(option.strip() for option in options)  # Format with new lines
    return text  # Return as-is if not a string

# Apply the formatting function to all rows in a specific column
column_name = "Front (html)"  # Change this to match your column name
df[column_name] = df[column_name].apply(format_options)

# Save the cleaned data back to a new Excel file
output_file = "formatted_questions.xlsx"
df.to_excel(output_file, index=False)

print(f"✅ Formatted Excel file saved as {output_file}")
