# LIST  
  
The `list` module has functions for working with lists of items.
These functions have no direct link with the model, they are generic functions for manipulating lists.
/n
The functions are often used when manipulating lists of IDs of entities in the model.
These functions neither make nor modify anything in the model.
/n
In addition to these functions, there are also various inline functions available for working with lists.  
  
  
## Add  
  
  
**Description:** Adds an item to a list.  
  
**Parameters:**  
  * *list:* List to add the item to.  
  * *item:* Item to add.  
  * *method:* Enum, select the method: `'to_start', 'to_end', 'extend_start', 'extend_end',
'alpha_descending', 'alpha_ascending', 'numeric_descending', 'numeric_ascending',
'ID_descending'` or `'ID_ascending'`.  
  
**Returns:** void  
**Examples:**  
  * `append = list.Add([1,2,3], 4, 'at_end')`  
    Expected value of list is `[1,2,3,4]`.  
  * `append = list.Add([1,2,3], [4, 5], 'at_end')`  
    Expected value of list is `[1,2,3,[4,5]]`.  
  * `append = list.Add([1,2,3], [4,5], 'extend_end')`  
    Expected value of list is `[1,2,3,4,5]`.  
  * `append = list.Add(["a", "c", "d"], "b", 'alpha_descending')`  
    Expected value of list is `["a", "b", "c", "d"]`.
  
  
  
## Remove  
  
  
**Description:** Removes items in a list.


If method is set to 'index', then item should be the index of the item to be replaced.
Negative indexes are allowed.
If method is not set to 'index', then item should be the value.  
  
**Parameters:**  
  * *list:* The list in which to remove items.  
  * *item:* The item to remove, either the index of the item or the value. Negative indexes are allowed.  
  * *method:* Enum, select the method for removing items from the list: `'index', 'first_value',
'last_value'` or `'all_values'`.  
  
**Returns:** void  
**Examples:**  
  * `list.Remove(list, 3, 'index')`  
    where `list = [0, 1, 2, 3]`. Expected new value of list is [0, 1, 2].  
  * `list.Remove(list, 3, 'all_values')`  
    where `list = [3, 1, 2, 3, 4]`. Expected new value of list is  [1, 2, 4].
  
  
  
## Replace  
  
  
**Description:** Replaces items in a list.


If method is set to 'index', then old\_item should be the index of the item to be replaced. Negative indexes are allowed.
If method is not set to 'index', then old\_item should be the value to be replaced.  
  
**Parameters:**  
  * *list:* The list in which to replace items.  
  * *old\_item:* The old item to replace.  
  * *new\_item:* The new item.  
  * *method:* Enum, select the method for replacing items in the list: `'index', 'first_value',
'last_value'` or `'all_values'`.  
  
**Returns:** void  
**Examples:**  
  * `list.Replace(list, 3, [6, 7, 8], 'last_value')`  
    where `list = [3, 1, 2, 3, 4]`.
Expected new value of list is `[3, 1, 2, [6, 7, 8], 4]`.  
  * `list.Replace(list, 2, 0, 'index')`  
    where `list = [0,1,2,3,4,5]`.
Expected new value of list is `[0,1,0,3,4,5]`.
  
  
  
## Sort  
  
  
**Description:** Sorts a list, based on the values of the items in the list. 
 For alphabetical sort, values are
sorted character by character, numbers before upper case alphabets, upper case alphabets before
lower case alphabets.  
  
**Parameters:**  
  * *list:* List to sort.  
  * *method:* Enum, specifies the sort method to use: `'reverse', 'alpha_descending',
'alpha_ascending', 'numeric_descending', 'numeric_ascending', 'ID_descending', 'ID_ascending',
'shift_1', 'reverse_shift_1'` or `'random'`.  
  
**Returns:** void  
**Examples:**  
  * `list.Sort(list, 'alpha')`  
    where `list = ["1","2","10","Orange","apple"]`. Expected value of list is
`["1","10","2","Orange","apple"]`.  
  * `list.Sort(list, 'numeric')`  
    where `list = [56,6,48]`. Expected value of list is `[6,48,56]`.
  
  
  
## Splice  
  
  
**Description:** Removes and inserts items in a list.


If no `items_to_add` are specified, then items are only removed.
If `num_to_remove` is 0, then values are only inserted.  
  
**Parameters:**  
  * *list:* List to splice.  
  * *index:* Zero-based index after which to start removing or inserting items.  
  * *num\_to\_remove:* Number of items to remove.  
  * *items\_to\_insert:* (Optional) List of items to add, or null/empty list.  
  
**Returns:** void  
**Examples:**  
  * `result = list.Splice(list1, 1, 3, [2.2, 3.3])`  
    where list1 = `[10, 20, 30, 40, 50]`.
Expected value of result is `[10, 2.2, 3.3, 50]`. New items were added where the items were removed.
  
  
  
