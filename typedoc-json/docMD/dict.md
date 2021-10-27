# DICT  
  
The `dict` module has functions for working with dictionaries.
These functions have no direct link with the model, the are generic functions for manipulating dictionaries.
These functions neither make nor modify anything in the model.
In addition to these functions, there are also inline functions available for working with dictionaries.  
  
  
## Add  
  
  
**Description:** Adds one or more key-value pairs to a dict. Existing keys with the same name will be overwritten.

  
  
**Parameters:**  
  * *dict:* Dictionary to add the key-value pairs to.  
  * *keys:* A key or list of keys.  
  * *values:* A value of list of values.  
  
**Returns:** void  
  
  
## Remove  
  
  
**Description:** Removes keys from a dict. If the key does not exist, no action is taken and no error is thrown.

  
  
**Parameters:**  
  * *dict:* The dict in which to remove keys  
  * *keys:* The key or list of keys to remove.  
  
**Returns:** void  
  
  
## Replace  
  
  
**Description:** Replaces keys in a dict. If the key does not exist, no action is taken and no error is thrown.

  
  
**Parameters:**  
  * *dict:* The dict in which to replace keys  
  * *old\_keys:* The old key or list of keys.  
  * *new\_keys:* The new key or list of keys.  
  
**Returns:** void  
  
  
