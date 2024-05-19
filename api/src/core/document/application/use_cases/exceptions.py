class InvalidDocument(Exception):
    pass


class DocumentNotFound(Exception):
    pass

class DocumentWithWrongFormat(Exception):
    pass

class DocumentAlreadyExists(Exception):
    pass

class GenericErrorUploadFile(Exception):
    pass

class DocumentNotIndexedDelete(Exception):
    pass